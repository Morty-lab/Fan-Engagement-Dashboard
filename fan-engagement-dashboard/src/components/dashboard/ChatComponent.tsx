import React, { useState, useRef, useEffect, useCallback } from "react";
import api from "../../api/client";
import usePusher from "../../hooks/usePusher";
import QuickReplyTemplatesComponent from "./QuickReplyTemplatesComponent";
import FanProfileSidebar from "./FanProfileSidebar";

interface Message {
  id: number;
  conversation_id: number;
  sender: "fan" | "chatter";
  content: string;
  created_at: string;
}

interface FanInfo {
  id: number;
  username: string;
  display_name: string;
  total_spent: string;
  created_at: string;
  updated_at: string;
}

interface ChatComponentProps {
  selectedConversationId: number | null;
  selectedFanId: number | null;
  isDarkMode: boolean;
  updateConversationLastMessage: (conversationId: number, lastMessage: string) => void;
  updateConversationUnreadCount: (conversationId: number, increment?: boolean) => void;
  onOpenMobileSidebar?: () => void; // New prop to handle opening mobile sidebar
}

const MESSAGES_PER_PAGE = 25;

const ChatComponent: React.FC<ChatComponentProps> = ({
  selectedConversationId,
  selectedFanId,
  isDarkMode,
  updateConversationLastMessage,
  updateConversationUnreadCount,
  onOpenMobileSidebar, // New prop
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [showFanInfo, setShowFanInfo] = useState(false);
  const [fanInfo, setFanInfo] = useState<FanInfo | null>(null);
  const [isLoadingFanInfo, setIsLoadingFanInfo] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef<number>(0);

  // Check if user is near bottom of chat
  const isNearBottom = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return true;

    const threshold = 100;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    return distanceFromBottom <= threshold;
  }, []);

  // Auto-scroll to bottom function
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Load fan info
  const loadFanInfo = useCallback(async (fanId: number) => {
    if (!fanId) return;
    
    setIsLoadingFanInfo(true);
    try {
      const response = await api.get(`/fan/${fanId}`);
      setFanInfo(response.data);
    } catch (error) {
      console.error("Failed to load fan info:", error);
      setFanInfo(null);
    } finally {
      setIsLoadingFanInfo(false);
    }
  }, []);

  // Load fan info when selectedFanId changes
  useEffect(() => {
    if (selectedFanId) {
      loadFanInfo(selectedFanId);
    } else {
      setFanInfo(null);
    }
  }, [selectedFanId, loadFanInfo]);

  // Load more messages function (for scrolling up to load older messages)
  const loadMoreMessages = useCallback(async () => {
    if (!selectedConversationId || isLoadingMore || !hasMoreMessages) return;

    setIsLoadingMore(true);
    const container = messagesContainerRef.current;
    const previousScrollHeight = container?.scrollHeight || 0;

    try {
      // Get the oldest message ID for pagination
      const oldestMessageId =
        messages.length > 0 ? Math.min(...messages.map((m) => m.id)) : null;
      const res = await api.get(`/conversation/${selectedConversationId}`, {
        params: {
          before: oldestMessageId,
          limit: MESSAGES_PER_PAGE,
        },
      });

      const newMessages = res.data.messages || [];

      if (newMessages.length < MESSAGES_PER_PAGE) {
        setHasMoreMessages(false);
      }

      if (newMessages.length > 0) {
        setMessages((prev) => [...newMessages, ...prev]);

        // Maintain scroll position after loading older messages
        setTimeout(() => {
          if (container) {
            const newScrollHeight = container.scrollHeight;
            container.scrollTop = newScrollHeight - previousScrollHeight;
          }
        }, 0);
      }
    } catch (err) {
      console.error("Failed to load more messages", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedConversationId, messages, isLoadingMore, hasMoreMessages]);

  // Handle scroll to detect when to load more messages and track auto-scroll behavior
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    setShouldAutoScroll(isNearBottom());

    if (container.scrollTop < 100 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, isLoadingMore, loadMoreMessages, isNearBottom]);

  // Pusher message handler
  usePusher(selectedConversationId, (newMsg) => {
    setMessages((prev) => {
      const messageExists = prev.some((msg) => msg.id === newMsg.id);
      if (messageExists) {
        console.log("Message already exists, skipping:", newMsg.id);
        return prev;
      }

      const updatedMessages = [...prev, newMsg];
      if (updatedMessages.length > MESSAGES_PER_PAGE * 2) {
        return updatedMessages.slice(-MESSAGES_PER_PAGE * 2);
      }
      return updatedMessages;
    });

    // Update the last message in the sidebar
    updateConversationLastMessage(newMsg.conversation_id, newMsg.content);

    // If the message is from a fan and it's not the currently selected conversation, increment unread count
    if (
      newMsg.sender === "fan" &&
      newMsg.conversation_id !== selectedConversationId
    ) {
      updateConversationUnreadCount(newMsg.conversation_id, true);
    }
  });

  // Handle auto-scroll for new messages
  useEffect(() => {
    const currentLength = messages.length;
    const previousLength = previousMessagesLength.current;

    if (currentLength > previousLength && shouldAutoScroll) {
      setTimeout(() => {
        scrollToBottom("smooth");
      }, 50);
    }

    previousMessagesLength.current = currentLength;
  }, [messages.length, shouldAutoScroll, scrollToBottom]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const loadConversationMessages = async () => {
      setIsLoading(true);
      setHasMoreMessages(true);
      setShouldAutoScroll(true);

      try {
        const res = await api.get(`/conversation/${selectedConversationId}`, {
          params: {
            limit: MESSAGES_PER_PAGE,
          },
        });

        const fetchedMessages = res.data.messages || [];

        // Sort messages by creation date to ensure newest are at the end
        const sortedMessages = fetchedMessages.sort(
          (a: Message, b: Message) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );

        setMessages(sortedMessages);

        if (fetchedMessages.length < MESSAGES_PER_PAGE) {
          setHasMoreMessages(false);
        }

        // Scroll to bottom immediately after loading newest messages
        setTimeout(() => {
          scrollToBottom("auto");
        }, 100);
      } catch (err) {
        console.error("Failed to load conversation messages", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversationMessages();
  }, [selectedConversationId, scrollToBottom]);

  // Handle template selection
  const handleTemplateSelect = (templateBody: string) => {
    setNewMessage(templateBody);
  };

  // Handle message submission
  const handleSubmitMessage = async (e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedConversationId) return;

    const messagePayload = {
      conversation_id: selectedConversationId,
      content: newMessage,
      sender: "chatter",
    };

    try {
      const response = await api.post("/message", messagePayload);

      // Update the last message in the sidebar immediately
      updateConversationLastMessage(selectedConversationId, newMessage);

      setNewMessage("");
      setShouldAutoScroll(true);

      // If the API returns the created message, it adds it to the messages state
      // This prevents duplicate messages when Pusher also sends the message
      if (response.data && response.data.id) {
        const sentMessage = response.data;
        setMessages((prev) => {
          const messageExists = prev.some((msg) => msg.id === sentMessage.id);
          if (!messageExists) {
            return [...prev, sentMessage];
          }
          return prev;
        });
      }
    } catch (error) {
      console.error("Message send failed:", error);
    }
  };

  const getSelectedFanName = () => {
    return fanInfo?.display_name || fanInfo?.username || "Fan";
  };

  if (!selectedConversationId) {
    return (
      <div className="flex flex-col h-full">
        {/* Mobile Header */}
        <header
          className={`md:hidden flex items-center justify-between p-3 border-b transition-colors duration-200 flex-shrink-0 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            type="button"
            className={`rounded-full p-2 focus:outline-none transition-colors duration-200 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={onOpenMobileSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Fan Engagement Dashboard</h1>
          <div className="flex items-center space-x-4">
            {/* Right side of header */}
          </div>
        </header>

        {/* No conversation selected content */}
        <div
          className={`flex flex-col items-center justify-center h-full text-center ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
          <p className="text-sm opacity-75">
            Select a conversation from the sidebar to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col ${showFanInfo ? 'mr-80' : ''} transition-all duration-300`}>
        {/* Mobile Header - Only visible on mobile when conversation is selected */}
        <header
          className={`md:hidden flex items-center justify-between p-3 border-b transition-colors duration-200 flex-shrink-0 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            type="button"
            className={`rounded-full p-2 focus:outline-none transition-colors duration-200 ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={onOpenMobileSidebar}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold truncate px-2">{getSelectedFanName()}</h1>
          <button
            onClick={() => setShowFanInfo(!showFanInfo)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            title="Fan Information"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </header>

        {/* Desktop Chat Header */}
        <div
          className={`hidden md:flex items-center justify-between p-4 border-b transition-colors duration-200 flex-shrink-0 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <span className="text-sm font-medium">
                {getSelectedFanName().charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold">{getSelectedFanName()}</h2>
            </div>
          </div>
          
          <button
            onClick={() => setShowFanInfo(!showFanInfo)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode
                ? "hover:bg-gray-700 text-gray-300 hover:text-white"
                : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
            }`}
            title="Fan Information"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
        </div>

        {/* Chat Messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0"
          onScroll={handleScroll}
        >
          {/* Load more indicator */}
          {isLoadingMore && (
            <div
              className={`text-center py-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <div className="inline-flex items-center">
                <svg
                  className={`animate-spin -ml-1 mr-3 h-5 w-5 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading more messages...
              </div>
            </div>
          )}

          {/* No more messages indicator */}
          {!hasMoreMessages && messages.length > 0 && (
            <div
              className={`text-center text-sm py-2 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              No more messages
            </div>
          )}

          {isLoading ? (
            <div
              className={`text-center ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Loading messages...
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "fan" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-md p-3 rounded-lg transition-colors duration-200 ${
                      msg.sender === "fan"
                        ? isDarkMode
                          ? "bg-gray-700"
                          : "bg-gray-200"
                        : "bg-blue-600"
                    }`}
                  >
                    <p
                      className={
                        msg.sender === "fan" && !isDarkMode
                          ? "text-gray-900"
                          : "text-white"
                      }
                    >
                      {msg.content}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "fan" && !isDarkMode
                          ? "text-gray-600"
                          : "text-gray-300"
                      }`}
                    >
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div
          className={`border-t p-4 transition-colors duration-200 flex-shrink-0 ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex gap-2">
            {/* Quick Reply Templates Button */}
            <QuickReplyTemplatesComponent
              onTemplateSelect={handleTemplateSelect}
              isDarkMode={isDarkMode}
              disabled={!selectedConversationId}
            />

            {/* Message Input */}
            <textarea
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmitMessage(e as any);
                }
              }}
              className={`flex-1 px-4 py-2 rounded-lg focus:outline-none resize-none transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-800 text-white border-gray-600 focus:border-blue-500"
                  : "bg-white text-gray-900 border-gray-300 focus:border-blue-500 border"
              }`}
              rows={2}
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSubmitMessage}
              disabled={!newMessage.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Fan Profile Sidebar */}
      <FanProfileSidebar
        isVisible={showFanInfo}
        onClose={() => setShowFanInfo(false)}
        fanInfo={fanInfo}
        isLoading={isLoadingFanInfo}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ChatComponent;
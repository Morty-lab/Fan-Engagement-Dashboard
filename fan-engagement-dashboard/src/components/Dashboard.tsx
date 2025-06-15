import React, { useState, useRef, useEffect, useCallback } from "react";
import FanSideBar from "./sidebars/FanSideBar";
import api from "../api/client";
import MobileFanSidebar from "./sidebars/MobileFanSidebar";
import usePusher from "../hooks/usePusher";
import QuickReplyTemplatesComponent from "./dashboard/QuickReplyTemplatesComponent";

interface Message {
  id: number;
  conversation_id: number;
  sender: "fan" | "chatter";
  content: string;
  created_at: string;
}

interface Conversation {
  id: number;
  fanName: string;
  lastMessage: string;
  priorityLevel: number;
  unreadCount: number;
}

const MESSAGES_PER_PAGE = 25;

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef<number>(0);

  // Function to update last message in conversations
  const updateConversationLastMessage = useCallback(
    (conversationId: number, lastMessage: string) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, lastMessage } : conv
        )
      );
    },
    []
  );

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

  // Load conversations on component mount
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const conversationRes = await api.get("/conversations");
      const conversationList = conversationRes.data;

      const enrichedConversations = await Promise.all(
        conversationList.map(async (conv: any) => {
          try {
            // Fetch fan info
            const fanRes = await api.get(`/fan/${conv.fan_id}`);
            const fanData = fanRes.data;

            // Fetch conversation details with messages to count unread
            const conversationDetailsRes = await api.get(
              `/conversation/${conv.id}`
            );
            const conversationDetails = conversationDetailsRes.data;

            // Count unread messages (where is_read is 0 or false)
            const unreadCount =
              conversationDetails.messages?.filter(
                (message: any) => message.is_read === 0
              ).length || 0;

            // Get the most recent message for lastMessage
            const sortedMessages = conversationDetails.messages?.sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
            const lastMessage = sortedMessages?.[0]?.content || "";

            return {
              id: conv.id,
              fanName: fanData.display_name || fanData.username,
              lastMessage: lastMessage,
              priorityLevel: conv.priority_level || 0,
              unreadCount: unreadCount,
            };
          } catch (error) {
            console.error(
              `Error loading conversation details for conversation_id ${conv.id}`,
              error
            );
            return {
              id: conv.id,
              fanName: "Unknown",
              lastMessage: "",
              priorityLevel: 0,
              unreadCount: 0,
            };
          }
        })
      );

      setConversations(enrichedConversations);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  // Function to update unread count for a specific conversation
  const updateConversationUnreadCount = useCallback(
    (conversationId: number, increment: boolean = true) => {
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? {
                ...conv,
                unreadCount: increment
                  ? conv.unreadCount + 1
                  : Math.max(0, conv.unreadCount - 1),
              }
            : conv
        )
      );
    },
    []
  );

  // Function to reset unread count when conversation is selected
  const resetUnreadCount = useCallback((conversationId: number) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    );
  }, []);

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

  // Handle conversation selection - Load newest messages first
  const handleConversationClick = async (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsLoading(true);
    setHasMoreMessages(true);
    setShouldAutoScroll(true);

    // Reset unread count when selecting a conversation
    resetUnreadCount(conversationId);

    try {
      const res = await api.get(`/conversation/${conversationId}`, {
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

  // Handle template selection
  const handleTemplateSelect = (templateBody: string) => {
    setNewMessage(templateBody);
  };

  // Handle message submission
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // If the API returns the created message, add it to the messages state
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

  // Handle priority change - Updated to match your endpoint
  const handlePriorityChange = async (
    conversationId: number,
    newPriority: number
  ) => {
    try {
      // Update the conversation priority via API - matching your endpoint structure
      await api.put(`/conversation/${conversationId}/priority`, {
        priority_level: newPriority,
      });

      // Update the local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId
            ? { ...conv, priorityLevel: newPriority }
            : conv
        )
      );

      console.log(`Updated conversation ${conversationId} priority to ${newPriority}`);
    } catch (error) {
      console.error("Failed to update conversation priority:", error);
      // Optionally, you could show a toast notification here
    }
  };

  // Handle mark as read - Updated to match your endpoint
  const handleMarkAsRead = async (conversationId: number) => {
    try {
      // Mark messages as read via API - matching your endpoint structure
      await api.post(`/conversation/${conversationId}/mark-read`);

      // Update the local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
        )
      );

      console.log(`Marked conversation ${conversationId} as read`);
    } catch (error) {
      console.error("Failed to mark conversation as read:", error);
      // Optionally, you could show a toast notification here
    }
  };

  return (
    <div
      className={`flex w-screen h-screen overflow-hidden transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Desktop Sidebar */}
      <div
        className={`w-[20%] border-r h-full overflow-y-auto hidden md:block transition-colors duration-200 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
      >
        <FanSideBar
          conversations={conversations}
          onConversationClick={handleConversationClick}
          selectedConversationId={selectedConversationId}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onPriorityChange={handlePriorityChange}
          onMarkAsRead={handleMarkAsRead}
        />
      </div>
      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Toggle sidebar button */}
        <header
          className={`md:hidden flex items-center justify-between py-2 border-b transition-colors duration-200 ${
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
            onClick={() => setShowMobileSidebar(true)}
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

        {/* Mobile Sidebar Overlay */}
        <MobileFanSidebar
          conversations={conversations}
          isOpen={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
          onConversationClick={handleConversationClick}
          selectedConversationId={selectedConversationId}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onPriorityChange={handlePriorityChange}
          onMarkAsRead={handleMarkAsRead}
        />

        {/* Chat messages */}
        <div
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
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
          ) : selectedConversationId ? (
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
          ) : (
            <div
              className={`text-center ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Select a conversation to start chatting
            </div>
          )}
        </div>

        {/* Message Input with Quick Reply Templates */}
        {selectedConversationId && (
          <div
            className={`h-[10vh] border-t p-4 transition-colors duration-200 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <form className="flex gap-2" onSubmit={handleSubmitMessage}>
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
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
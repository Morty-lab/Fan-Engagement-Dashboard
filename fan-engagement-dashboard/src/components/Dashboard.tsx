import React, { useState, useRef, useEffect, useCallback } from "react";
import FanSideBar from "./sidebars/FanSideBar";
import api from "../api/client";
import MobileFanSidebar from "./sidebars/MobileFanSidebar";
import usePusher from "../hooks/usePusher";

interface Message {
  id: number;
  conversation_id: number;
  sender: "fan" | "chatter";
  content: string;
  created_at: string;
}

const MESSAGES_PER_PAGE = 25;

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom function
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Load more messages function
  const loadMoreMessages = useCallback(async () => {
    if (!selectedConversationId || isLoadingMore || !hasMoreMessages) return;

    setIsLoadingMore(true);
    try {
      const oldestMessageId = messages.length > 0 ? Math.min(...messages.map(m => m.id)) : null;
      const res = await api.get(`/conversation/${selectedConversationId}`, {
        params: {
          before: oldestMessageId,
          limit: MESSAGES_PER_PAGE
        }
      });

      const newMessages = res.data.messages || [];
      
      if (newMessages.length < MESSAGES_PER_PAGE) {
        setHasMoreMessages(false);
      }

      if (newMessages.length > 0) {
        setMessages(prev => [...newMessages, ...prev]);
      }
    } catch (err) {
      console.error("Failed to load more messages", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [selectedConversationId, messages, isLoadingMore, hasMoreMessages]);

  // Handle scroll to detect when to load more messages
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    // Check if scrolled to top (with some threshold)
    if (container.scrollTop < 100 && hasMoreMessages && !isLoadingMore) {
      loadMoreMessages();
    }
  }, [hasMoreMessages, isLoadingMore, loadMoreMessages]);

  // Pusher message handler
  usePusher(selectedConversationId, (newMsg) => {
    setMessages((prev) => {
      const messageExists = prev.some(msg => msg.id === newMsg.id);
      if (messageExists) {
        console.log('Message already exists, skipping:', newMsg.id);
        return prev;
      }
      
      // Keep only the latest messages (limit to prevent memory issues)
      const updatedMessages = [...prev, newMsg];
      if (updatedMessages.length > MESSAGES_PER_PAGE * 2) {
        return updatedMessages.slice(-MESSAGES_PER_PAGE * 2);
      }
      return updatedMessages;
    });
  });

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // Handle conversation selection
  const handleConversationClick = async (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsLoading(true);
    setHasMoreMessages(true);
    
    try {
      const res = await api.get(`/conversation/${conversationId}`, {
        params: {
          limit: MESSAGES_PER_PAGE
        }
      });
      
      const fetchedMessages = res.data.messages || [];
      setMessages(fetchedMessages);
      
      if (fetchedMessages.length < MESSAGES_PER_PAGE) {
        setHasMoreMessages(false);
      }
      
      // Scroll to bottom immediately after loading
      setTimeout(() => scrollToBottom("auto"), 100);
    } catch (err) {
      console.error("Failed to load conversation messages", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-[20%] bg-gray-800 border-r border-gray-700 h-full overflow-y-auto hidden md:block">
        <FanSideBar onConversationClick={handleConversationClick} />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Toggle sidebar button */}
        <header className="md:hidden flex items-center justify-between py-2 border-b border-gray-700">
          <button
            type="button"
            className="bg-gray-700 rounded-full p-2 focus:outline-none"
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
          isOpen={showMobileSidebar}
          onClose={() => setShowMobileSidebar(false)}
          onConversationClick={handleConversationClick}
        />

        {/* Chat messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          onScroll={handleScroll}
        >
          {/* Load more indicator */}
          {isLoadingMore && (
            <div className="text-center text-gray-400 py-2">
              <div className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading more messages...
              </div>
            </div>
          )}

          {/* No more messages indicator */}
          {!hasMoreMessages && messages.length > 0 && (
            <div className="text-center text-gray-500 text-sm py-2">
              No more messages
            </div>
          )}

          {isLoading ? (
            <div className="text-center text-gray-400">Loading messages...</div>
          ) : selectedConversationId ? (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "fan" ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-md p-3 rounded-lg ${
                      msg.sender === "fan"
                        ? "bg-gray-700"
                        : "bg-blue-600"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="text-center text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>

        {/* Textbox */}
        {selectedConversationId && (
          <div className="h-[10vh] border-t border-gray-700 p-4">
            <form
              className="flex gap-2"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!newMessage.trim() || !selectedConversationId) return;

                const messagePayload = {
                  conversation_id: selectedConversationId,
                  content: newMessage,
                  sender: "chatter",
                };

                try {
                  await api.post("/message", messagePayload);
                  setNewMessage("");
                  // Message will be added via Pusher and auto-scrolled
                } catch (error) {
                  console.error("Message send failed:", error);
                }
              }}
            >
              <textarea
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.form?.requestSubmit();
                  }
                }}
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none resize-none"
                rows={2}
              />
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
import React, { useState, useEffect, useCallback } from "react";
import FanSideBar from "./sidebars/FanSideBar";
import api from "../api/client";
import MobileFanSidebar from "./sidebars/MobileFanSidebar";
import AnalyticsSectionComponent from "./dashboard/AnalyticsSectionComponent";
import ChatComponent from "./dashboard/ChatComponent";

interface Conversation {
  id: number;
  fanName: string;
  lastMessage: string;
  priorityLevel: number;
  unreadCount: number;
  fan_id?: number;
}

const Dashboard: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [selectedFanId, setSelectedFanId] = useState<number | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(true); // Default to true to show analytics on load

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

  // Toggle analytics visibility
  const handleToggleAnalytics = useCallback(() => {
    setShowAnalytics((prev) => !prev);
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
              fan_id: conv.fan_id,
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
              fan_id: conv.fan_id,
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

  // Handle conversation selection
  const handleConversationClick = async (conversationId: number) => {
    const selectedConversation = conversations.find(
      (conv) => conv.id === conversationId
    );

    setSelectedConversationId(conversationId);
    setSelectedFanId(selectedConversation?.fan_id || null);
    setShowAnalytics(false); // Hide analytics when a conversation is selected

    // Reset unread count when selecting a conversation
    resetUnreadCount(conversationId);
  };

  // Handle priority change
  const handlePriorityChange = async (
    conversationId: number,
    newPriority: number
  ) => {
    try {
      // Update the conversation priority via API
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

      console.log(
        `Updated conversation ${conversationId} priority to ${newPriority}`
      );
    } catch (error) {
      console.error("Failed to update conversation priority:", error);
    }
  };

  // Handle mark as read
  const handleMarkAsRead = async (conversationId: number) => {
    try {
      // Mark messages as read via API
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
          showAnalytics={showAnalytics}
          onToggleAnalytics={handleToggleAnalytics}
        />
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col h-full">
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
          showAnalytics={showAnalytics}
          onToggleAnalytics={handleToggleAnalytics}
        />

        {/* Main Content Area */}
        {showAnalytics ? (
          // Analytics Dashboard
          <div className="flex-1 overflow-y-auto p-4">
            <AnalyticsSectionComponent
              isDarkMode={isDarkMode}
              onOpenMobileSidebar={() => setShowMobileSidebar(true)}
            />
          </div>
        ) : (
          // Chat Interface
          <ChatComponent
            selectedConversationId={selectedConversationId}
            selectedFanId={selectedFanId}
            isDarkMode={isDarkMode}
            updateConversationLastMessage={updateConversationLastMessage}
            updateConversationUnreadCount={updateConversationUnreadCount}
            onOpenMobileSidebar={() => setShowMobileSidebar(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;

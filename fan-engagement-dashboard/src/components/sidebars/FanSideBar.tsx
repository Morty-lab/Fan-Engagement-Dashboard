import React, { useState } from "react";
import { Search, Moon, Sun, BarChart3 } from "lucide-react";
import ConversationComponent from "../messages/ConversationComponent";

interface Conversation {
  id: number;
  fanName: string;
  lastMessage: string;
  priorityLevel: number;
  unreadCount: number;
}

interface FanSideBarProps {
  conversations: Conversation[];
  onConversationClick: (conversationId: number) => void;
  selectedConversationId?: number | null;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onPriorityChange?: (conversationId: number, newPriority: number) => void;
  onMarkAsRead?: (conversationId: number) => void;
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
}

const FanSideBar: React.FC<FanSideBarProps> = ({ 
  conversations,
  onConversationClick,
  selectedConversationId,
  isDarkMode, 
  setIsDarkMode,
  onPriorityChange,
  onMarkAsRead,
  showAnalytics,
  onToggleAnalytics
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((conversation) =>
    conversation.fanName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort conversations by priority level only (1 = high, 2 = medium, 3 = low, 0 = none)
  const sortedConversations = filteredConversations.sort((a, b) => {
    if (a.priorityLevel !== b.priorityLevel) {
      if (a.priorityLevel === 0) return 1; // Move 0 to end
      if (b.priorityLevel === 0) return -1; // Move 0 to end
      return a.priorityLevel - b.priorityLevel; // Lower number = higher priority
    }
    
    // Maintain original order if priority levels are equal
    return 0;
  });

  return (
    <aside className={`w-full flex flex-col justify-between transition-colors duration-200 ${
      isDarkMode 
        ? "bg-gray-800" 
        : "bg-gray-100"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 m-4">
        <h1 className={`text-xl font-bold transition-colors duration-200 ${
          isDarkMode 
            ? "text-white" 
            : "text-gray-900"
        }`}>
          Fan Engagement Dashboard
        </h1>
        <div className="flex items-center space-x-2">
          {/* Analytics Toggle Button */}
          <button
            onClick={onToggleAnalytics}
            title="Analytics"
            className={`p-2 rounded transition-colors duration-200 ${
              isDarkMode 
                ? "hover:bg-gray-700" 
                : "hover:bg-gray-200"
            } ${
              showAnalytics 
                ? isDarkMode 
                  ? "bg-gray-700 text-blue-400" 
                  : "bg-gray-200 text-blue-600"
                : ""
            }`}
          >
            <BarChart3 className={`h-5 w-5 ${
              showAnalytics 
                ? isDarkMode 
                  ? "text-blue-400" 
                  : "text-blue-600"
                : isDarkMode 
                  ? "text-gray-400" 
                  : "text-gray-600"
            }`} />
          </button>
          
          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
            className={`p-2 rounded transition-colors duration-200 ${
              isDarkMode 
                ? "hover:bg-gray-700" 
                : "hover:bg-gray-200"
            }`}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4 m-4">
        <Search className={`absolute left-2 top-3 h-4 w-4 ${
          isDarkMode 
            ? "text-gray-400" 
            : "text-gray-500"
        }`} />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-8 pr-2 py-2 rounded border text-sm transition-colors duration-200 ${
            isDarkMode 
              ? "border-gray-600 bg-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500" 
              : "border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500"
          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
      </div>

      {/* Conversations */}
      <div className="overflow-y-auto flex-1 pr-1 space-y-2">
        {conversations.length === 0 ? (
          <div className={`p-4 text-center transition-colors duration-200 ${
            isDarkMode 
              ? "text-gray-300" 
              : "text-gray-600"
          }`}>
            No conversations available
          </div>
        ) : (
          sortedConversations.map((conversation) => (
            <ConversationComponent
              key={conversation.id}
              conversation={conversation}
              onClick={() => onConversationClick(conversation.id)}
              isActive={selectedConversationId === conversation.id}
              isDarkMode={isDarkMode}
              onPriorityChange={onPriorityChange}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>
    </aside>
  );
};

export default FanSideBar;
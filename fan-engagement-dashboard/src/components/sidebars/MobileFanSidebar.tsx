import React, { useState } from "react";
import { Search, X, Moon, Sun } from "lucide-react";
import ConversationComponent from "../messages/ConversationComponent";

interface Conversation {
  id: number;
  fanName: string;
  lastMessage: string;
  priorityLevel: number;
  unreadCount: number;
}

interface Props {
  conversations: Conversation[];
  isOpen: boolean;
  onClose: () => void;
  onConversationClick: (conversationId: number) => void;
  selectedConversationId?: number | null;
  isDarkMode: boolean;
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onPriorityChange?: (conversationId: number, newPriority: number) => void;
  onMarkAsRead?: (conversationId: number) => void;
}

const MobileFanSidebar: React.FC<Props> = ({
  conversations,
  isOpen,
  onClose,
  onConversationClick,
  selectedConversationId,
  isDarkMode,
  setIsDarkMode,
  onPriorityChange,
  onMarkAsRead,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.fanName.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleConversationClick = (conversationId: number) => {
    onClose();
    onConversationClick(conversationId);
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 transform transition-all duration-300 block md:hidden flex flex-col ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } ${
        isDarkMode 
          ? "bg-gray-900 text-white" 
          : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b transition-colors duration-200 ${
        isDarkMode 
          ? "border-gray-700" 
          : "border-gray-200"
      }`}>
        <h2 className="text-lg font-bold">Conversations</h2>
        <div className="flex items-center space-x-2">
          {/* Dark mode toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
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
          {/* Close button */}
          <button onClick={onClose}>
            <X className={`h-6 w-6 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative m-4">
        <Search className={`absolute left-3 top-2.5 h-4 w-4 ${
          isDarkMode 
            ? "text-gray-400" 
            : "text-gray-500"
        }`} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 rounded-lg transition-colors duration-200 ${
            isDarkMode 
              ? "bg-gray-800 text-white placeholder:text-gray-400 border border-gray-700 focus:border-blue-500" 
              : "bg-gray-100 text-gray-900 placeholder:text-gray-500 border border-gray-300 focus:border-blue-500"
          } focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
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
              onClick={() => handleConversationClick(conversation.id)}
              isActive={selectedConversationId === conversation.id}
              isDarkMode={isDarkMode}
              onPriorityChange={onPriorityChange}
              onMarkAsRead={onMarkAsRead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MobileFanSidebar;
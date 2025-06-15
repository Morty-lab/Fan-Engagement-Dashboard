import React from "react";

interface Conversation {
  id: number;
  fanName: string;
  lastMessage: string;
  priorityLevel: number;
  unreadCount: number;
}

interface Props {
  conversation: Conversation;
  onClick?: () => void;
  isDarkMode?: boolean;
}

const getPriorityColor = (priorityLevel: number): string => {
  switch (priorityLevel) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-yellow-500";
    case 3:
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const ConversationComponent: React.FC<Props> = ({ 
  conversation, 
  onClick, 
  isDarkMode = false 
}) => {
  return (
    <div
      key={conversation.id}
      className={`w-full p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
        isDarkMode 
          ? "bg-gray-800 hover:bg-gray-700" 
          : "bg-white hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className={`font-semibold transition-colors duration-200 ${
            isDarkMode 
              ? "text-white" 
              : "text-gray-900"
          }`}>
            {conversation.fanName}
          </h3>
          <p className={`text-sm line-clamp-2 transition-colors duration-200 ${
            isDarkMode 
              ? "text-gray-300" 
              : "text-gray-600"
          }`}>
            {conversation.lastMessage}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {/* Priority Dot */}
          <span
            className={`w-3 h-3 rounded-full ${getPriorityColor(
              conversation.priorityLevel
            )}`}
          ></span>
          {/* Unread Count */}
          {conversation.unreadCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationComponent;
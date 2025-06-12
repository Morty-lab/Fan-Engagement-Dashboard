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

const ConversationComponent: React.FC<Props> = ({ conversation, onClick }) => {
  return (
    <div
      key={conversation.id}
      className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg  cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {conversation.fanName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
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

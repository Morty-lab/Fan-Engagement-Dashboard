import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Check, Flag } from "lucide-react";


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
  isActive?: boolean;
  onPriorityChange?: (conversationId: number, newPriority: number) => void;
  onMarkAsRead?: (conversationId: number) => void;
}

const getPriorityColor = (priorityLevel: number): string => {
  switch (priorityLevel) {
    case 1:
      return "bg-red-500";
    case 2:
      return "bg-orange-500";
    case 3:
      return "bg-yellow-500";
    default:
      return "bg-gray-500";
  }
};

const getPriorityLabel = (priorityLevel: number): string => {
  switch (priorityLevel) {
    case 1:
      return "High";
    case 2:
      return "Medium";
    case 3:
      return "Low";
    default:
      return "None";
  }
};

const ConversationComponent: React.FC<Props> = ({ 
  conversation, 
  onClick, 
  isDarkMode = false,
  isActive = false,
  onPriorityChange,
  onMarkAsRead
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showPriorityMenu, setShowPriorityMenu] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  // Close options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
      if (priorityRef.current && !priorityRef.current.contains(event.target as Node)) {
        setShowPriorityMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
    setShowPriorityMenu(false);
  };

  const handlePriorityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPriorityMenu(!showPriorityMenu);
  };

  const handlePriorityChange = (newPriority: number) => {
    if (onPriorityChange) {
      onPriorityChange(conversation.id, newPriority);
    }
    setShowPriorityMenu(false);
    setShowOptions(false);
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead(conversation.id);
    }
    setShowOptions(false);
  };

  const priorityOptions = [
    { value: 0, label: "None", color: "bg-gray-500" },
    { value: 1, label: "High", color: "bg-red-500" },
    { value: 2, label: "Medium", color: "bg-orange-500" },
    { value: 3, label: "Low", color: "bg-yellow-500" },
  ];

  return (
    <div
      className={`group relative w-full p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
        isActive
          ? isDarkMode
            ? "bg-blue-900 border-blue-500 shadow-lg"
            : "bg-blue-50 border-blue-500 shadow-lg"
          : isDarkMode 
            ? "bg-gray-800 hover:bg-gray-700 border-transparent hover:border-gray-600" 
            : "bg-white hover:bg-gray-50 border-transparent hover:border-gray-200"
      } ${showOptions || showPriorityMenu ? 'z-50' : 'z-10'}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold truncate transition-colors duration-200 ${
              isActive
                ? isDarkMode
                  ? "text-blue-200"
                  : "text-blue-800"
                : isDarkMode 
                  ? "text-white" 
                  : "text-gray-900"
            }`}>
              {conversation.fanName}
            </h3>
            {/* Priority indicator */}
            {conversation.priorityLevel > 0 && (
              <span
                className={`w-2 h-2 rounded-full ${getPriorityColor(conversation.priorityLevel)}`}
                title={`Priority: ${getPriorityLabel(conversation.priorityLevel)}`}
              />
            )}
          </div>
          <p className={`text-sm line-clamp-2 transition-colors duration-200 ${
            isActive
              ? isDarkMode
                ? "text-blue-300"
                : "text-blue-700"
              : isDarkMode 
                ? "text-gray-300" 
                : "text-gray-600"
          }`}>
            {conversation.lastMessage || "No messages yet..."}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2 relative">
          {/* Unread Count */}
          {conversation.unreadCount > 0 && (
            <span className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${
              isActive ? "bg-blue-600" : "bg-blue-500"
            }`}>
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          )}
          
          {/* Options Button - Always visible on mobile, hover on desktop */}
          <div className="relative" ref={optionsRef}>
            <button
              onClick={handleOptionsClick}
              className={`p-1 rounded-full transition-all duration-200 md:opacity-0 md:group-hover:opacity-100 hover:opacity-100 ${
                showOptions ? "opacity-100" : "opacity-100 md:opacity-0"
              } ${
                isDarkMode 
                  ? "hover:bg-gray-600 text-gray-300 hover:text-white" 
                  : "hover:bg-gray-200 text-gray-500 hover:text-gray-700"
              }`}
              title="More options"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            
            {/* Options Dropdown */}
            {showOptions && (
              <div className={`absolute right-0 top-8 w-48 rounded-lg shadow-lg border z-[100] ${
                isDarkMode 
                  ? "bg-gray-800 border-gray-600" 
                  : "bg-white border-gray-200"
              }`}>
                {/* Mark as Read */}
                {conversation.unreadCount > 0 && (
                  <button
                    onClick={handleMarkAsRead}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors duration-200 ${
                      isDarkMode 
                        ? "hover:bg-gray-700 text-gray-200" 
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    Mark as Read
                  </button>
                )}
                
                {/* Priority Menu */}
                <div className="relative" ref={priorityRef}>
                  <button
                    onClick={handlePriorityClick}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 justify-between transition-colors duration-200 ${
                      isDarkMode 
                        ? "hover:bg-gray-700 text-gray-200" 
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      Set Priority
                    </div>
                    <span className={`w-2 h-2 rounded-full ${getPriorityColor(conversation.priorityLevel)}`} />
                  </button>
                  
                  {/* Priority Submenu */}
                  {showPriorityMenu && (
                    <div className={`absolute right-full top-0 w-32 rounded-lg shadow-xl border mr-1 z-[110] ${
                      isDarkMode 
                        ? "bg-gray-800 border-gray-600" 
                        : "bg-white border-gray-200"
                    }`}>
                      {priorityOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handlePriorityChange(option.value)}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 transition-colors duration-200 first:rounded-t-lg last:rounded-b-lg ${
                            conversation.priorityLevel === option.value
                              ? isDarkMode
                                ? "bg-gray-700 text-blue-400"
                                : "bg-gray-100 text-blue-600"
                              : isDarkMode 
                                ? "hover:bg-gray-700 text-gray-200" 
                                : "hover:bg-gray-100 text-gray-700"
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${option.color}`} />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationComponent;
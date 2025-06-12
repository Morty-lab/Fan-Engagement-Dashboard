import React, { useState, useEffect } from "react";
import { Search, Moon, Sun } from "lucide-react";
import api from "../../api/client";
import ConversationComponent from "../messages/ConversationComponent";

interface Conversation {
  id: number;
  fanName: string;
  lastMessage: string;
  priorityLevel: number;
  unreadCount: number;
}

interface FanSideBarProps {
  onConversationClick: (conversationId: number) => void;
}
// interface FanSideBarProps {
//   isDarkMode: boolean;
//   setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
// }
const FanSideBar: React.FC<FanSideBarProps> = ({ onConversationClick }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const conversationRes = await api.get("/conversations");
      const conversationList = conversationRes.data;

      const enrichedConversations = await Promise.all(
        conversationList.map(async (conv: any) => {
          try {
            const fanRes = await api.get(`/fan/${conv.fan_id}`);
            const fanData = fanRes.data;

            return {
              id: conv.id,
              fanName: fanData.display_name || fanData.username,
              lastMessage: "shamalama", // Replace with actual message logic if needed
              priorityLevel: 3, // Replace with actual logic if needed
              unreadCount: 4, // Replace with actual logic if needed
            };
          } catch (error) {
            console.error(
              `Error loading fan info for fan_id ${conv.fan_id}`,
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
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conversation) =>
    conversation.fanName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-full bg-gray-100 dark:bg-gray-800 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 m-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Chatter Name
        </h1>
        <button
          onClick={() => {
            setIsDarkMode(!isDarkMode);
          }}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-400" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4 m-4">
        <Search className="absolute left-2 top-3 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-2 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
      </div>

      {/* Conversations */}
       <div className="overflow-y-auto flex-1 pr-1">
        {isLoading ? (
          <div className="p-4 text-center text-gray-600 dark:text-gray-300">
            Loading conversations...
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationComponent
              key={conversation.id}
              conversation={conversation}
              onClick={() => onConversationClick(conversation.id)}
            />
          ))
        )}
      </div>

      
    </aside>
  );
};

export default FanSideBar;


// src/components/sidebars/MobileFanSidebar.tsx

import React, { useEffect, useState, useRef } from "react";
import { Search, X } from "lucide-react";
import api from "../../api/client";
import ConversationComponent from "../messages/ConversationComponent";

interface Conversation {
  id: number;
  fanName: string;
  lastMessage: string;
  priorityLevel: number;
  unreadCount: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConversationClick: (conversationId: number) => void;
}

const MobileFanSidebar: React.FC<Props> = ({
  isOpen,
  onClose,
  onConversationClick,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cache flag to avoid reloading data
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !hasLoadedRef.current) {
      loadConversations();
    }
  }, [isOpen]);

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
      hasLoadedRef.current = true;
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.fanName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
  className={`fixed top-0 left-0 w-full h-full z-50 bg-gray-900 text-white transform transition-transform duration-300 block md:hidden flex flex-col ${
    isOpen ? "translate-x-0" : "translate-x-full"
  }`}
>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
        <h2 className="text-lg font-bold">Conversations</h2>
        <button onClick={onClose}>
          <X className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Search */}
      <div className="relative m-4">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-white placeholder:text-gray-400"
        />
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading ? (
          <div className="p-4 text-center text-gray-600 dark:text-gray-300">
            Loading conversations...
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationComponent
              key={conversation.id}
              conversation={conversation}
              onClick={() => {
                onClose();
                onConversationClick(conversation.id);
              }}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MobileFanSidebar;

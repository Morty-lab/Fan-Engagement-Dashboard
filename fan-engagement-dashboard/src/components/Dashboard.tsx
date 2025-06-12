import React, { useState } from "react";
import FanSideBar from "./sidebars/FanSideBar";
import api from "../api/client";
import MobileFanSidebar from "./sidebars/MobileFanSidebar";

interface Message {
  id: number;
  conversation_id: number;
  sender: "fan" | "chatter";
  content: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<
    number | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const handleConversationClick = async (conversationId: number) => {
    setSelectedConversationId(conversationId);
    setIsLoading(true);
    try {
      const res = await api.get(`/conversation/${conversationId}`);
      console.log(res.data);
      setMessages(res.data.messages);
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading messages...</div>
          ) : selectedConversationId ? (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-md p-3 rounded-lg ${
                  msg.sender === "fan"
                    ? "bg-gray-700 self-start"
                    : "bg-blue-600 self-end"
                }`}
              >
                <p>{msg.content}</p>
                <p className="text-xs text-gray-300 mt-1">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400">
              Select a conversation to start chatting
            </div>
          )}
        </div>

        {/* Textbox */}
        <div className="h-[10vh] border-t border-gray-700 p-4">
          <form className="flex gap-2">
            <textarea
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

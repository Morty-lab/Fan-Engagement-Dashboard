import React from "react";

interface FanInfo {
  id: number;
  username: string;
  display_name: string;
  total_spent: string;
  created_at: string;
  updated_at: string;
}

interface FanProfileSidebarProps {
  isVisible: boolean;
  onClose: () => void;
  fanInfo: FanInfo | null;
  isLoading: boolean;
  isDarkMode: boolean;
}

const FanProfileSidebar: React.FC<FanProfileSidebarProps> = ({
  isVisible,
  onClose,
  fanInfo,
  isLoading,
  isDarkMode,
}) => {
  const getSelectedFanName = () => {
    return fanInfo?.display_name || fanInfo?.username || "Fan";
  };

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed right-0 top-0 h-full w-80 border-l p-6 overflow-y-auto transition-colors duration-200 z-50 ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Fan Information</h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors duration-200 ${
            isDarkMode
              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {isLoading ? (
        <div
          className={`text-center py-8 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <div className="inline-flex items-center">
            <svg
              className={`animate-spin -ml-1 mr-3 h-5 w-5 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Loading fan info...
          </div>
        </div>
      ) : fanInfo ? (
        <div className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="text-center">
            <div
              className={`w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              }`}
            >
              <span className="text-2xl font-medium">
                {getSelectedFanName().charAt(0).toUpperCase()}
              </span>
            </div>
            <h4 className="text-lg font-semibold">{fanInfo.display_name}</h4>
            {fanInfo.username && fanInfo.username !== fanInfo.display_name && (
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                @{fanInfo.username}
              </p>
            )}
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h5 className="font-medium text-sm uppercase tracking-wide opacity-75">
              Account Information
            </h5>
            
            <div className="flex items-center space-x-3">
              <svg
                className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium">Member Since</p>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {new Date(fanInfo.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <svg
                className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  {new Date(fanInfo.updated_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h5 className="font-medium text-sm uppercase tracking-wide opacity-75">
              Financial Information
            </h5>
            
            <div className="flex items-center space-x-3">
              <svg
                className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              <div>
                <p className="text-sm font-medium">Total Spent</p>
                <p className={`text-lg font-bold ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  {formatCurrency(fanInfo.total_spent)}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="pt-4 border-t space-y-2">
            <button
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "bg-gray-700 hover:bg-gray-600 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-900"
              }`}
            >
              View Full Profile
            </button>
            <button
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Send Quick Message
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`text-center py-8 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <p>Unable to load fan information</p>
        </div>
      )}
    </div>
  );
};

export default FanProfileSidebar;
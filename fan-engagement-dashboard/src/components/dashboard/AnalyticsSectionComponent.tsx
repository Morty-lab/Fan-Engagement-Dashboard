import React from "react";
import { TrendingUp, TrendingDown, Users, DollarSign, Heart, MessageCircle, Star, Target, Menu } from "lucide-react";

interface AnalyticsSectionProps {
  isDarkMode: boolean;
  setShowMobileSidebar?: (show: boolean) => void;
  onOpenMobileSidebar?: () => void;
}

const AnalyticsSectionComponent: React.FC<AnalyticsSectionProps> = ({ 
  isDarkMode, 
  setShowMobileSidebar,
  onOpenMobileSidebar 
}) => {
  // Dummy data for analytics
  const analyticsData = {
    totalSubscribers: 12847,
    subscriberGrowth: 8.3,
    freeToPayConversion: 23.7,
    conversionGrowth: 2.1,
    totalRevenue: 47580,
    revenueGrowth: 12.4,
    avgRevenuePerUser: 145.60,
    arpuGrowth: -3.2,
    contentViews: 158943,
    viewsGrowth: 15.7,
    engagementRate: 34.2,
    engagementGrowth: 5.8,
    topSpenders: 87,
    tipRevenue: 8950,
  };

  const StatCard = ({ 
    title, 
    value, 
    growth, 
    icon: Icon, 
    prefix = "", 
    suffix = "" 
  }: {
    title: string;
    value: string | number;
    growth?: number;
    icon: any;
    prefix?: string;
    suffix?: string;
  }) => (
    <div className={`p-3 rounded-lg transition-colors duration-200 ${
      isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200 shadow-sm"
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg ${
            isDarkMode ? "bg-gray-700" : "bg-gray-100"
          }`}>
            <Icon className={`h-4 w-4 ${
              isDarkMode ? "text-blue-400" : "text-blue-600"
            }`} />
          </div>
          <div>
            <p className={`text-xs font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}>
              {title}
            </p>
            <p className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}>
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
          </div>
        </div>
        {growth !== undefined && (
          <div className={`flex items-center space-x-1 ${
            growth >= 0 ? "text-green-500" : "text-red-500"
          }`}>
            {growth >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">
              {Math.abs(growth)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`h-full flex flex-col transition-colors duration-200 ${
      isDarkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      {/* Mobile Header - Fixed height */}
      <div className={`md:hidden flex items-center justify-between p-4 border-b transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => {
              if (setShowMobileSidebar) setShowMobileSidebar(true);
              if (onOpenMobileSidebar) onOpenMobileSidebar();
            }}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkMode 
                ? "text-gray-300 hover:bg-gray-800 hover:text-white" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className={`text-lg font-semibold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Fan Engagement Dashboard
          </h1>
        </div>
        
        {/* Right side of header */}
        <div className="flex items-center space-x-2">
          {/* You can add additional header items here */}
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 p-4 overflow-y-auto transition-colors duration-200 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}>
        {/* Header - Hidden on mobile since we have the mobile header */}
        <div className="hidden md:block mb-4">
          <h2 className={`text-xl font-bold mb-1 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}>
            Analytics Dashboard
          </h2>
          <p className={`text-xs ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Overview of your fan engagement and revenue metrics
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard
            title="Total Subscribers"
            value={analyticsData.totalSubscribers}
            growth={analyticsData.subscriberGrowth}
            icon={Users}
          />
          <StatCard
            title="Free to Paid Conversion"
            value={analyticsData.freeToPayConversion}
            growth={analyticsData.conversionGrowth}
            icon={Target}
            suffix="%"
          />
          <StatCard
            title="Total Revenue"
            value={analyticsData.totalRevenue}
            growth={analyticsData.revenueGrowth}
            icon={DollarSign}
            prefix="$"
          />
          <StatCard
            title="Avg Revenue Per User"
            value={analyticsData.avgRevenuePerUser}
            growth={analyticsData.arpuGrowth}
            icon={Star}
            prefix="$"
          />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard
            title="Content Views"
            value={analyticsData.contentViews}
            growth={analyticsData.viewsGrowth}
            icon={Heart}
          />
          <StatCard
            title="Engagement Rate"
            value={analyticsData.engagementRate}
            growth={analyticsData.engagementGrowth}
            icon={MessageCircle}
            suffix="%"
          />
          <StatCard
            title="Top Spenders"
            value={analyticsData.topSpenders}
            icon={TrendingUp}
          />
          <StatCard
            title="Tips Revenue"
            value={analyticsData.tipRevenue}
            icon={DollarSign}
            prefix="$"
          />
        </div>

        {/* Quick Insights */}
        <div className={`p-3 rounded-lg ${
          isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-blue-50 border border-blue-200"
        }`}>
          <h3 className={`text-sm font-semibold mb-2 ${
            isDarkMode ? "text-white" : "text-blue-900"
          }`}>
            Quick Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className={`text-xs ${
              isDarkMode ? "text-gray-300" : "text-blue-800"
            }`}>
              <span className="font-medium">Best Performing Day:</span> Saturday
            </div>
            <div className={`text-xs ${
              isDarkMode ? "text-gray-300" : "text-blue-800"
            }`}>
              <span className="font-medium">Peak Activity:</span> 8-10 PM
            </div>
            <div className={`text-xs ${
              isDarkMode ? "text-gray-300" : "text-blue-800"
            }`}>
              <span className="font-medium">Conversion Rate Trend:</span> ↗️ Improving
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSectionComponent;
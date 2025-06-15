import React, { useState, useEffect, useRef } from "react";
import api from "../../api/client";

interface Template {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

interface QuickReplyTemplatesProps {
  onTemplateSelect: (templateBody: string) => void;
  isDarkMode: boolean;
  disabled?: boolean;
}

const QuickReplyTemplatesComponent: React.FC<QuickReplyTemplatesProps> = ({
  onTemplateSelect,
  isDarkMode,
  disabled = false
}) => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get("/templates");
        setTemplates(response.data || []);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
        setError("Failed to load templates");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTemplateClick = (template: Template) => {
    onTemplateSelect(template.body);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Enhanced Templates Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled || isLoading}
        className={`group h-[52px] px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 flex items-center shadow-sm border-2 ${
          disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
        } ${
          isDarkMode
            ? `bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 
               text-white border-gray-600 hover:border-gray-500 focus:ring-blue-400`
            : `bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 
               text-gray-700 border-gray-300 hover:border-gray-400 focus:ring-blue-500`
        } ${
          isDropdownOpen 
            ? isDarkMode 
              ? "ring-2 ring-blue-400 border-blue-400" 
              : "ring-2 ring-blue-500 border-blue-500"
            : ""
        }`}
        title="Quick Reply Templates"
      >
        <div className="flex items-center space-x-2">
          {/* Icon with loading state */}
          <div className="relative">
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <>
                {/* Main template icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isDropdownOpen ? "scale-110" : "group-hover:scale-105"
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {/* Badge showing template count */}
                {templates.length > 0 && (
                  <div className={`absolute -top-2 -right-2 h-4 w-4 rounded-full text-xs flex items-center justify-center font-medium ${
                    isDarkMode 
                      ? "bg-blue-500 text-white" 
                      : "bg-blue-600 text-white"
                  }`}>
                    {templates.length > 9 ? "9+" : templates.length}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Text */}
          <span className="text-sm font-medium">Templates</span>
          
          {/* Dropdown arrow */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : "group-hover:translate-y-0.5"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Enhanced Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className={`absolute bottom-full left-0 mb-3 w-96 max-h-80 rounded-2xl shadow-2xl border backdrop-blur-sm z-50 transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in ${
            isDarkMode
              ? "bg-gray-800/95 border-gray-600 shadow-black/50"
              : "bg-white/95 border-gray-200 shadow-gray-900/10"
          }`}
        >
          {error ? (
            <div className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                isDarkMode ? "bg-red-900/20" : "bg-red-50"
              }`}>
                <svg className={`w-6 h-6 ${isDarkMode ? "text-red-400" : "text-red-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className={`text-sm font-medium ${isDarkMode ? "text-red-400" : "text-red-600"}`}>
                {error}
              </p>
            </div>
          ) : templates.length === 0 ? (
            <div className="p-6 text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}>
                <svg className={`w-6 h-6 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                No templates available
              </p>
            </div>
          ) : (
            <div className="py-2">
              {/* Header */}
              <div className={`px-5 py-3 border-b ${
                isDarkMode ? "border-gray-700" : "border-gray-100"
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                    Quick Reply Templates
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkMode 
                      ? "bg-gray-700 text-gray-300" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {templates.length} available
                  </span>
                </div>
              </div>
              
              {/* Templates List */}
              <div className="max-h-64 overflow-y-auto">
                {templates.map((template, index) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template)}
                    className={`w-full text-left px-5 py-4 transition-all duration-200 hover:scale-[1.01] ${
                      isDarkMode
                        ? "hover:bg-gray-700/70 text-white border-gray-700"
                        : "hover:bg-gray-50 text-gray-900 border-gray-100"
                    } ${
                      index < templates.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm truncate pr-2">
                        {template.title}
                      </h4>
                      <svg className={`w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className={`text-xs leading-relaxed line-clamp-3 ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}>
                      {template.body}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickReplyTemplatesComponent;
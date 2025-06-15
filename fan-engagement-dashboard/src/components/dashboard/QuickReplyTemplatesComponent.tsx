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
      {/* Templates Button */}
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled || isLoading}
        className={`px-3 py-2 rounded-lg focus:outline-none transition-colors duration-200 ${
          disabled || isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-80"
        } ${
          isDarkMode
            ? "bg-gray-700 hover:bg-gray-600 text-white border border-gray-600"
            : "bg-gray-200 hover:bg-gray-300 text-gray-900 border border-gray-300"
        }`}
        title="Quick Reply Templates"
      >
        <div className="flex items-center space-x-1">
          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          )}
          <span className="text-sm">Templates</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform duration-200 ${
              isDropdownOpen ? "rotate-180" : ""
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

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div
          className={`absolute bottom-full left-0 mb-2 w-80 max-h-60 overflow-y-auto rounded-lg shadow-lg border z-50 transition-colors duration-200 ${
            isDarkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-200"
          }`}
        >
          {error ? (
            <div className={`p-4 text-center ${
              isDarkMode ? "text-red-400" : "text-red-600"
            }`}>
              {error}
            </div>
          ) : templates.length === 0 ? (
            <div className={`p-4 text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
              No templates available
            </div>
          ) : (
            <div className="py-2">
              <div className={`px-4 py-2 text-xs font-semibold uppercase tracking-wide border-b ${
                isDarkMode
                  ? "text-gray-400 border-gray-600"
                  : "text-gray-500 border-gray-200"
              }`}>
                Quick Reply Templates ({templates.length})
              </div>
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className={`w-full text-left px-4 py-3 transition-colors duration-200 ${
                    isDarkMode
                      ? "hover:bg-gray-700 text-white"
                      : "hover:bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="font-medium text-sm mb-1">
                    {template.title}
                  </div>
                  <div className={`text-xs line-clamp-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}>
                    {template.body}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuickReplyTemplatesComponent;
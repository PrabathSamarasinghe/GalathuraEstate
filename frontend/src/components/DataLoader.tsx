import { useState } from "react";
import { loadDummyData, clearAllData } from "../utils/dummyData";

const DataLoader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-300 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 className="text-sm font-bold text-gray-900">🎲 Developer Tools</h3>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700 text-lg leading-none px-2"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? "□" : "−"}
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-700 text-lg leading-none px-2"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>
      {!isMinimized && (
        <div className="p-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={loadDummyData}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
            >
              Load Dummy Data
            </button>
            <button
              onClick={clearAllData}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
            >
              Clear All Data
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            20 employees + 7 days attendance
          </p>
        </div>
      )}
    </div>
  );
};

export default DataLoader;

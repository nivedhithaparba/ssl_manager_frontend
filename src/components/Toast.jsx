import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: { 
      bg: 'bg-green-50 border-green-200', 
      text: 'text-green-800', 
      icon: CheckCircle 
    },
    error: { 
      bg: 'bg-red-50 border-red-200', 
      text: 'text-red-800', 
      icon: XCircle 
    },
    info: { 
      bg: 'bg-blue-50 border-blue-200', 
      text: 'text-blue-800', 
      icon: Info 
    }
  };

  const config = typeConfig[type] || typeConfig.info;
  const IconComponent = config.icon;

  return (
    <div className={`fixed top-4 right-4 ${config.bg} ${config.text} border rounded-lg p-4 animate-bounce-in flex items-center space-x-3 shadow-lg z-50 max-w-sm`}>
      <IconComponent className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium flex-1">{message}</span>
      <button 
        onClick={onClose} 
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;

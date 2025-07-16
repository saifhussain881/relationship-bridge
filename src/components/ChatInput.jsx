import React, { useState, useEffect } from 'react';
import socketService from '../services/socketService';

const ChatInput = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      // Clear typing indicator when message is sent
      if (isTyping) {
        setIsTyping(false);
        socketService.sendStopTyping();
      }
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    if (!isTyping) {
      setIsTyping(true);
      socketService.sendTyping();
    }
    
    // Reset typing timeout
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Set timeout to clear typing indicator after 2 seconds of inactivity
    setTypingTimeout(
      setTimeout(() => {
        setIsTyping(false);
        socketService.sendStopTyping();
      }, 2000)
    );
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white border-t border-gray-200 p-4 sticky bottom-0"
    >
      <div className="flex items-center">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          disabled={disabled}
          placeholder={disabled ? "Please wait..." : "Share your thoughts..."}
          className="flex-1 border border-gray-300 rounded-l-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-primary text-white py-3 px-6 rounded-r-md hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput; 
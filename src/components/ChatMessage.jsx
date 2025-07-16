import React from 'react';

const ChatMessage = ({ message, isUser }) => {
  const { sender, content, timestamp, role, isSystem } = message;
  
  // Format timestamp
  const formattedTime = new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  // Handle system messages
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
          {content} • {formattedTime}
        </div>
      </div>
    );
  }
  
  // Determine message style based on sender
  const getMessageStyle = () => {
    if (sender === 'You') {
      return 'bg-primary text-white ml-auto';
    } else if (sender === 'Pastor Grace') {
      return 'bg-orange-500 text-white';
    } else {
      return 'bg-gray-200 text-gray-800';
    }
  };

  // Get avatar for sender
  const getAvatar = () => {
    if (sender === 'You') {
      return (
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
          <span>{sender.charAt(0)}</span>
        </div>
      );
    } else if (sender === 'Pastor Grace') {
      return (
        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center">
          <span>{sender.charAt(0)}</span>
        </div>
      );
    }
  };
  
  return (
    <div className={`flex ${sender === 'You' ? 'justify-end' : 'justify-start'} mb-4`}>
      {sender !== 'You' && (
        <div className="mr-2 mt-1">
          {getAvatar()}
        </div>
      )}
      
      <div className={`max-w-[80%]`}>
        <div className="flex items-center mb-1">
          <span className="text-xs font-medium text-gray-600">{sender}</span>
          {role && (
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {role}
            </span>
          )}
          <span className="text-xs text-gray-400 ml-2">{formattedTime}</span>
        </div>
        
        <div className={`rounded-lg px-4 py-2 ${getMessageStyle()}`}>
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
      
      {sender === 'You' && (
        <div className="ml-2 mt-1">
          {getAvatar()}
        </div>
      )}
    </div>
  );
};

export default ChatMessage; 
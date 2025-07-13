import React from 'react';

const TypingIndicator = ({ userName }) => {
  return (
    <div className="flex items-center mb-4">
      <div className="bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-500">
        {userName ? `${userName} is typing` : 'Someone is typing'}
        <span className="dots">
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </span>
      </div>
      <style jsx="true">{`
        .dots {
          display: inline-block;
        }
        .dot {
          animation: wave 1.3s linear infinite;
          display: inline-block;
          opacity: 0;
        }
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes wave {
          0%, 60%, 100% {
            opacity: 0;
            transform: translateY(0);
          }
          10% {
            opacity: 0.3;
            transform: translateY(-2px);
          }
          50% {
            opacity: 0.9;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default TypingIndicator; 
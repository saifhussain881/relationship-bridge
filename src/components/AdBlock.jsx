import React, { useState, useEffect } from 'react';
import DonateButton from './DonateButton';

const AdBlock = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerCompleted, setTimerCompleted] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setTimerCompleted(true);
    }
  }, [timeLeft]);

  const handleContinue = () => {
    if (timerCompleted) {
      onComplete();
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="p-4 bg-lavender border-b border-gray-200">
        <h3 className="text-lg font-semibold text-primary">Support GraceBridge</h3>
        <p className="text-sm text-gray-600">Please watch this brief message from our sponsors</p>
      </div>
      
      <div className="aspect-video bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-2">Mock Video Player</p>
          <p className="text-gray-400 text-sm">(This would be a real video in production)</p>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">
            {timeLeft > 0 ? (
              <span>Please wait: <span className="text-primary">{timeLeft}s</span> remaining</span>
            ) : (
              <span className="text-green-600">You may continue</span>
            )}
          </div>
          <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 ml-4">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${((60 - timeLeft) / 60) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <DonateButton />
          
          <button
            onClick={handleContinue}
            disabled={!timerCompleted}
            className={`py-2 px-6 rounded-md transition-colors ${
              timerCompleted
                ? 'bg-primary text-white hover:opacity-90'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdBlock; 
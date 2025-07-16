import React from 'react';

const DonateButton = () => {
  const handleDonateClick = () => {
    // In a real app, this would redirect to a donation page or open a modal
    alert('Thank you for your interest in supporting GraceBridge! This would redirect to a donation page in a real application.');
  };

  return (
    <button
      onClick={handleDonateClick}
      className="flex items-center justify-center gap-2 py-2 px-6 bg-white border-2 border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors"
    >
      <span className="text-xl">❤</span>
      <span>Support GraceBridge</span>
    </button>
  );
};

export default DonateButton; 
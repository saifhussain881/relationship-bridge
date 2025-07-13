import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ sessionId }) => {
  const location = useLocation();
  const isSessionPage = location.pathname.includes('/session/');
  
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container-custom flex items-center">
        <Link to="/" className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">FaithConnect</h1>
            <p className="text-xs text-gray-500">Christian Relationship Counseling</p>
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header; 
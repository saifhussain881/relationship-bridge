import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const JoinPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [sessionCode, setSessionCode] = useState('');
  const [joinMode, setJoinMode] = useState('create'); // 'create' or 'join'
  const [error, setError] = useState('');

  const generateSessionId = () => {
    // Generate a random 6-character alphanumeric code
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateSession = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    // Store user info in sessionStorage
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('sessionId', generateSessionId());
    
    navigate('/waiting');
  };

  const handleJoinSession = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!sessionCode.trim()) {
      setError('Please enter a session code');
      return;
    }
    
    // Store user info in sessionStorage
    sessionStorage.setItem('userName', name);
    sessionStorage.setItem('sessionId', sessionCode.toUpperCase());
    
    navigate('/waiting');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center container-custom py-10">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-primary mb-6">
            {joinMode === 'create' ? 'Create a New Session' : 'Join Existing Session'}
          </h1>
          
          <div className="flex mb-6">
            <button
              onClick={() => setJoinMode('create')}
              className={`flex-1 py-2 text-center ${
                joinMode === 'create'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Create New
            </button>
            <button
              onClick={() => setJoinMode('join')}
              className={`flex-1 py-2 text-center ${
                joinMode === 'join'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Join with Code
            </button>
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          {joinMode === 'create' ? (
            <form onSubmit={handleCreateSession}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Your Name or Nickname
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-3 mt-2"
              >
                Create New Session
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinSession}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Your Name or Nickname
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="sessionCode" className="block text-gray-700 mb-2">
                  Session Code
                </label>
                <input
                  type="text"
                  id="sessionCode"
                  value={sessionCode}
                  onChange={(e) => setSessionCode(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter 6-character code"
                  maxLength={6}
                />
              </div>
              
              <button
                type="submit"
                className="w-full btn-primary py-3 mt-2"
              >
                Join Session
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default JoinPage; 
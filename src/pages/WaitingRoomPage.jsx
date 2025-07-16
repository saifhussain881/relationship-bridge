import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import socketService from '../services/socketService';

const WaitingRoomPage = () => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [userName, setUserName] = useState('');
  const [copied, setCopied] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [partnerJoined, setPartnerJoined] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  // Define event handlers with useCallback
  const handleConnect = useCallback(() => {
    console.log('Connected to socket server in waiting room');
    setIsConnected(true);
    setConnectionError('');
  }, []);

  // Handle user joined event
  const handleUserJoined = useCallback((user) => {
    console.log('User joined in waiting room:', user);
    if (user.userName !== userName) {
      setPartnerJoined(true);
    }
  }, [userName]);
  
  // Handle session users
  const handleSessionUsers = useCallback((users) => {
    console.log('Received session users in waiting room:', users);
    // Check if there are other users already in the session
    if (users && users.length > 0) {
      const otherUsers = users.filter(user => user.userName !== userName);
      if (otherUsers.length > 0) {
        console.log('Found other users in session:', otherUsers);
        setPartnerJoined(true);
      }
    }
  }, [userName]);

  useEffect(() => {
    // Get session info from sessionStorage
    const storedSessionId = sessionStorage.getItem('sessionId');
    const storedUserName = sessionStorage.getItem('userName');
    
    if (!storedSessionId || !storedUserName) {
      // Redirect to join page if no session info
      navigate('/join');
      return;
    }
    
    setSessionId(storedSessionId);
    setUserName(storedUserName);

    console.log('Initializing socket connection in waiting room');
    // Initialize socket connection
    socketService.connect(storedSessionId, storedUserName);

    // Listen for connection events
    socketService.on('connect', handleConnect);
    socketService.on('user_joined', handleUserJoined);
    socketService.on('session_users', handleSessionUsers);

    return () => {
      socketService.off('connect', handleConnect);
      socketService.off('user_joined', handleUserJoined);
      socketService.off('session_users', handleSessionUsers);
      
      // Don't disconnect here as we'll need the connection in the session page
    };
  }, [navigate, handleConnect, handleUserJoined, handleSessionUsers]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleStartChat = () => {
    setIsJoining(true);
    // Navigate to session page
    navigate(`/session/${sessionId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header sessionId={sessionId} />
      
      <main className="flex-1 flex flex-col items-center justify-center container-custom py-10">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md text-center">
          <div className="w-24 h-24 bg-lavender rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl text-primary">🙏</span>
          </div>
          
          <h1 className="text-2xl font-bold text-primary mb-2">Waiting Room</h1>
          <p className="text-gray-600 mb-6">
            {partnerJoined 
              ? "Your partner has joined! You can now start the session."
              : "Waiting for your partner to join..."}
          </p>
          
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-600 mb-2">Share this code with your partner:</p>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-mono font-bold tracking-wider text-primary">
                {sessionId}
              </span>
              <button 
                onClick={handleCopyCode}
                className="ml-2 p-2 text-gray-500 hover:text-primary"
                title="Copy to clipboard"
              >
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-center mb-2">
              <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <p className="text-sm">
                {isConnected ? 'Connected to server' : 'Connecting to server...'}
              </p>
            </div>
            
            <div className="flex items-center justify-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${partnerJoined ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <p className="text-sm">
                {partnerJoined ? 'Partner joined' : 'Waiting for partner'}
              </p>
            </div>
          </div>
          
          {connectionError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">
              {connectionError}
            </div>
          )}
          
          <button
            onClick={handleStartChat}
            className={`btn-primary w-full py-3 ${isJoining ? 'opacity-75 cursor-wait' : ''} ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isConnected || isJoining}
          >
            {isJoining 
              ? 'Joining Session...' 
              : partnerJoined 
                ? 'Start Session' 
                : 'Start Without Partner'}
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            {partnerJoined 
              ? "Both you and your partner are ready to begin."
              : "For demo purposes, you can start the chat without a partner joining."}
          </p>
        </div>
      </main>
    </div>
  );
};

export default WaitingRoomPage; 
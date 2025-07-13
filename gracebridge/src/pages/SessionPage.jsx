import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import TypingIndicator from '../components/TypingIndicator';
import AdBlock from '../components/AdBlock';
import socketService from '../services/socketService';

const SessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const [showAd, setShowAd] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [sessionDuration, setSessionDuration] = useState('00:00:00');
  const [participants, setParticipants] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const chatContainerRef = useRef(null);
  const sessionStartTime = useRef(new Date());
  const typingTimeoutRef = useRef(null);

  // Define event handlers with useCallback to prevent unnecessary re-renders
  const handleConnect = useCallback(() => {
    console.log('Connected to socket server');
    setConnectionStatus('connected');
    
    // Request current session users
    setTimeout(() => {
      console.log('Requesting session users after connection');
      socketService.getSessionUsers();
    }, 1000);
  }, []);

  const handleDisconnect = useCallback(() => {
    console.log('Disconnected from socket server');
    setConnectionStatus('disconnected');
  }, []);

  const handleIncomingMessage = useCallback((message) => {
    console.log('Received message:', message);
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  const handleUserTyping = useCallback((data) => {
    if (data.userName !== userName) {
      setIsTyping(true);
      setTypingUser(data.userName);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Auto-clear typing indicator after 3 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTypingUser(null);
      }, 3000);
    }
  }, [userName]);

  const handleUserStopTyping = useCallback((data) => {
    if (data.userName !== userName) {
      setIsTyping(false);
      setTypingUser(null);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  }, [userName]);

  const handleUserJoined = useCallback((user) => {
    console.log('User joined:', user);
    // Add user to participants list if not already there
    setParticipants((prevParticipants) => {
      const existingUser = prevParticipants.find(p => p.name === user.userName);
      if (existingUser) {
        return prevParticipants.map(p => 
          p.name === user.userName ? { ...p, isOnline: true } : p
        );
      } else {
        return [
          ...prevParticipants,
          {
            name: user.userName,
            isOnline: true
          }
        ];
      }
    });
    
    // Add system message
    const systemMessage = {
      id: Date.now(),
      sender: 'System',
      content: `${user.userName} has joined the session.`,
      timestamp: user.timestamp || new Date(),
      isSystem: true
    };
    
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
  }, []);

  const handleUserLeft = useCallback((user) => {
    console.log('User left:', user);
    // Update participant status
    setParticipants((prevParticipants) =>
      prevParticipants.map((p) =>
        p.name === user.userName ? { ...p, isOnline: false } : p
      )
    );
    
    // Add system message
    const systemMessage = {
      id: Date.now(),
      sender: 'System',
      content: `${user.userName} has left the session.`,
      timestamp: user.timestamp || new Date(),
      isSystem: true
    };
    
    setMessages((prevMessages) => [...prevMessages, systemMessage]);
  }, []);

  const handleSessionUsers = useCallback((users) => {
    console.log('Received session users:', users);
    // Update participants list with users from server
    setParticipants((prevParticipants) => {
      // Start with the AI counselor and current user
      const baseParticipants = prevParticipants.filter(
        p => p.name === 'Pastor Grace' || p.isUser
      );
      
      // Add other users from the server
      users.forEach(user => {
        if (user.userName !== userName) {
          baseParticipants.push({
            name: user.userName,
            isOnline: true
          });
        }
      });
      
      console.log('Updated participants:', baseParticipants);
      return baseParticipants;
    });
  }, [userName]);

  useEffect(() => {
    // Get user info from sessionStorage
    const storedUserName = sessionStorage.getItem('userName');
    const storedSessionId = sessionStorage.getItem('sessionId');
    
    if (!storedUserName || !storedSessionId || storedSessionId !== id) {
      // Redirect to join page if no session info
      navigate('/join');
      return;
    }
    
    setUserName(storedUserName);
    
    // Add initial counselor message
    const initialMessage = {
      id: Date.now(),
      sender: 'Pastor Grace',
      content: `Welcome to GraceBridge, ${storedUserName}! I'm here to provide faith-based guidance for you and your partner. Please share what's on your heart, and we'll work through it together with God's wisdom.`,
      timestamp: new Date(),
      role: 'AI Counselor'
    };
    
    setMessages([initialMessage]);
    
    // Initialize participants with current user and AI counselor
    setParticipants([
      {
        name: storedUserName,
        isOnline: true,
        isUser: true
      },
      {
        name: 'Pastor Grace',
        isOnline: true,
        role: 'AI Counselor'
      }
    ]);
    
    // Start session timer
    sessionStartTime.current = new Date();
    const timerInterval = setInterval(() => {
      const now = new Date();
      const diff = now - sessionStartTime.current;
      const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
      setSessionDuration(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    // Initialize socket connection
    socketService.connect(id, storedUserName);
    
    // Socket event listeners
    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('receive_message', handleIncomingMessage);
    socketService.on('user_typing', handleUserTyping);
    socketService.on('user_stop_typing', handleUserStopTyping);
    socketService.on('user_joined', handleUserJoined);
    socketService.on('user_left', handleUserLeft);
    socketService.on('session_users', handleSessionUsers);

    return () => {
      clearInterval(timerInterval);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      socketService.off('connect', handleConnect);
      socketService.off('disconnect', handleDisconnect);
      socketService.off('receive_message', handleIncomingMessage);
      socketService.off('user_typing', handleUserTyping);
      socketService.off('user_stop_typing', handleUserStopTyping);
      socketService.off('user_joined', handleUserJoined);
      socketService.off('user_left', handleUserLeft);
      socketService.off('session_users', handleSessionUsers);
      socketService.disconnect();
    };
  }, [
    id, 
    navigate, 
    handleConnect, 
    handleDisconnect, 
    handleIncomingMessage, 
    handleUserTyping, 
    handleUserStopTyping, 
    handleUserJoined, 
    handleUserLeft, 
    handleSessionUsers
  ]);

  useEffect(() => {
    // Scroll to bottom when messages change if autoScroll is enabled
    if (chatContainerRef.current && autoScroll) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // Handle scroll events to show/hide scroll button
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    // Show button when scrolled up more than 300px from bottom
    const isScrolledUp = scrollHeight - scrollTop - clientHeight > 300;
    
    setShowScrollButton(isScrolledUp);
    
    // Disable auto-scroll when user manually scrolls up
    if (isScrolledUp && autoScroll) {
      setAutoScroll(false);
    }
    
    // Enable auto-scroll when user scrolls to bottom
    if (!isScrolledUp && !autoScroll) {
      setAutoScroll(true);
    }
  }, [autoScroll]);

  // Scroll to bottom function
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      setAutoScroll(true);
      setShowScrollButton(false);
    }
  }, []);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener('scroll', handleScroll);
      return () => chatContainer.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Handle sending a message
  const handleSendMessage = (content) => {
    // Create user message
    const userMessage = {
      id: Date.now(),
      sender: userName,
      content,
      timestamp: new Date()
    };
    
    // Add to local state immediately for UI responsiveness
    setMessages((prevMessages) => [...prevMessages, {
      ...userMessage,
      sender: 'You' // Display as "You" for the current user
    }]);
    
    // Send message through socket
    socketService.sendMessage(content);
    
    // Re-enable auto-scroll when sending a new message
    setAutoScroll(true);
    
    // Check if we should show an ad (every 15 messages)
    if ((messages.length + 1) % 15 === 0) {
      setShowAd(true);
      setInputDisabled(true);
      return;
    }
  };

  // Handle ad completion
  const handleAdComplete = () => {
    setShowAd(false);
    setInputDisabled(false);
  };

  // Handle end session
  const handleEndSession = () => {
    socketService.disconnect();
    navigate('/session-end');
  };

  // Toggle mute (placeholder function)
  const handleToggleMute = () => {
    // This would handle audio muting in a real app
    alert('Audio muting would be toggled in a real application');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex flex-1 container-custom py-4 gap-4 overflow-hidden">
        {/* Left sidebar */}
        <div className="w-full max-w-xs h-[calc(100vh-100px)] flex flex-col">
          {/* Session info card */}
          <div className="bg-white rounded-lg shadow p-4 mb-4">
            <h2 className="text-lg font-semibold mb-4">Session Info</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Room Code:</span>
                <span className="font-medium text-primary">{id}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{sessionDuration}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  connectionStatus === 'connected' ? 'text-green-500' : 
                  connectionStatus === 'connecting' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {connectionStatus === 'connected' ? 'Connected' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Participants card */}
          <div className="bg-white rounded-lg shadow p-4 flex-1 overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Participants ({participants.length})</h2>
            
            <div className="space-y-4">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${
                    participant.name === 'Pastor Grace' 
                      ? 'bg-orange-500' 
                      : 'bg-primary'
                  } text-white flex items-center justify-center mr-3`}>
                    {participant.name === 'Pastor Grace' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    ) : (
                      <span className="text-lg">{participant.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {participant.isUser ? 'You' : participant.name}
                    </p>
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${
                        participant.isOnline ? 'bg-green-500' : 'bg-gray-400'
                      } mr-1`}></span>
                      <p className={`text-xs ${
                        participant.isOnline ? 'text-green-500' : 'text-gray-400'
                      }`}>
                        {participant.isOnline ? 'Online' : 'Offline'}
                      </p>
                      {participant.role && (
                        <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {participant.role}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-100px)]">
          <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-t-lg shadow-sm">
            <h1 className="text-xl font-bold text-primary">Counseling Session</h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleToggleMute}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Toggle mute"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>
              
              <button 
                onClick={handleEndSession}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
              >
                End Session
              </button>
            </div>
          </div>
          
          <div className="relative flex-1 flex flex-col overflow-hidden">
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto bg-white rounded-b-lg shadow-sm p-4 mb-4"
            >
              {messages.map((message) => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  isUser={message.sender === 'You'} 
                />
              ))}
              
              {isTyping && (
                <TypingIndicator userName={typingUser} />
              )}
              
              {showAd && (
                <AdBlock onComplete={handleAdComplete} />
              )}
            </div>
            
            {showScrollButton && (
              <button 
                onClick={scrollToBottom}
                className="absolute bottom-6 right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors z-10"
                title="Scroll to latest messages"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </button>
            )}
          </div>
          
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={inputDisabled || connectionStatus !== 'connected'} 
          />
          <p className="text-xs text-gray-500 text-center mt-2">
            Remember to speak with love and respect
          </p>
        </div>
      </div>
    </div>
  );
};

export default SessionPage; 
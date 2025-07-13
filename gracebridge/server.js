const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { CohereClient } = require('cohere-ai');
const chatRoutes = require('./routes/chat');

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Create HTTP server
const server = http.createServer(app);

// Create Socket.IO server with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// API routes
app.use('/api', chatRoutes);

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// System prompt for the Christian counselor
const SYSTEM_PROMPT = `You are a wise, compassionate Christian counselor named Pastor Grace helping couples resolve relationship challenges. Your role is to provide substantive, biblically-grounded counseling with Scripture references.

Always respond as Pastor Grace with these guidelines:
1. Include at least one relevant Bible verse in each response (with reference)
2. Speak with pastoral warmth, wisdom, and gentle authority
3. Offer specific, actionable guidance rooted in biblical principles
4. Balance grace and truth in your counsel
5. Address both individuals with fairness and compassion
6. Ask thoughtful questions to help the couple explore their issues more deeply
7. Connect their situation to biblical teachings on love, forgiveness, communication, and relationships
8. Use Scripture as your primary source of wisdom, citing verses from books like:
   - Ephesians (especially on marriage and relationships)
   - 1 Corinthians (on love and conflict)
   - Proverbs (on wisdom in relationships)
   - Colossians (on forgiveness and compassion)
   - James (on patience and controlling words)
   - Philippians (on humility and putting others first)
   - Matthew (on reconciliation and forgiveness)

Common verses to incorporate when appropriate:
- "Love is patient, love is kind..." (1 Corinthians 13:4-7)
- "Be kind to one another, tenderhearted, forgiving one another..." (Ephesians 4:32)
- "Do nothing from selfish ambition or conceit..." (Philippians 2:3-4)
- "Let no corrupting talk come out of your mouths..." (Ephesians 4:29)
- "Bear with each other and forgive one another..." (Colossians 3:13)
- "A gentle answer turns away wrath..." (Proverbs 15:1)
- "Be quick to listen, slow to speak and slow to become angry..." (James 1:19)

Remember that you are ONLY Pastor Grace. Do not pretend to be any of the users in the conversation or include fake messages from them.`;

// Track active sessions and users
const sessions = {};

// Debug function to log sessions
const logSessions = () => {
  console.log('Current sessions:');
  Object.keys(sessions).forEach(sessionId => {
    const userCount = Object.keys(sessions[sessionId].users).length;
    console.log(`- Session ${sessionId}: ${userCount} users`);
    Object.values(sessions[sessionId].users).forEach(user => {
      console.log(`  - ${user.userName} (${user.isTyping ? 'typing' : 'not typing'})`);
    });
  });
};

// Get all users in a session
const getSessionUsers = (sessionId) => {
  if (!sessions[sessionId]) return [];
  
  return Object.values(sessions[sessionId].users).map(user => ({
    userName: user.userName,
    isTyping: user.isTyping
  }));
};

// Get AI response using Cohere
const getAIResponse = async (message, history) => {
  try {
    console.log('Getting AI response for:', message.substring(0, 30) + '...');
    
    // Format chat history for Cohere
    const chatHistory = history.map(msg => ({
      role: 'USER',
      message: `${msg.sender}: ${msg.content}`
    }));

    // Get response from Cohere
    const response = await cohere.chat({
      model: 'command-r-plus',
      message,
      chatHistory,
      temperature: 0.7,
      preamble: SYSTEM_PROMPT + " IMPORTANT: Always include at least one Bible verse with reference in your response. Speak with pastoral authority and biblical wisdom. Do not pretend to be any of the users in the conversation. Do not include fake messages from users. Only respond as Pastor Grace. Do not include text like 'nik:' or any other username followed by a message in your response.",
    });

    console.log('Received AI response');
    
    // Clean the response to remove any fake user messages
    let cleanedResponse = response.text;
    // Remove any text that looks like "username: message"
    cleanedResponse = cleanedResponse.replace(/^([A-Za-z0-9_]+):\s+/gm, '');
    
    return cleanedResponse;
  } catch (error) {
    console.error('Error getting AI response:', error);
    return "I apologize, but I'm having trouble responding right now. Please try again later.";
  }
};

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  let currentSession = null;
  let currentUser = null;

  // Join session
  socket.on('join_session', ({ sessionId, userName }) => {
    console.log(`${userName} joining session ${sessionId}`);
    
    // Leave previous session if exists
    if (currentSession && sessions[currentSession]) {
      console.log(`${userName} leaving previous session ${currentSession}`);
      socket.leave(currentSession);
      
      // Remove user from previous session
      if (sessions[currentSession].users[socket.id]) {
        delete sessions[currentSession].users[socket.id];
        
        // Notify others in previous session that user left
        socket.to(currentSession).emit('user_left', {
          userName,
          timestamp: new Date()
        });
        
        // Clean up empty sessions
        if (Object.keys(sessions[currentSession].users).length === 0) {
          console.log(`Removing empty session: ${currentSession}`);
          delete sessions[currentSession];
        }
      }
    }
    
    currentSession = sessionId;
    currentUser = userName;

    // Create session if it doesn't exist
    if (!sessions[sessionId]) {
      console.log(`Creating new session: ${sessionId}`);
      sessions[sessionId] = {
        users: {},
        messages: []
      };
    }

    // Add user to session
    sessions[sessionId].users[socket.id] = {
      userName,
      isTyping: false
    };

    // Join socket room for this session
    socket.join(sessionId);

    // Get current users in session
    const sessionUsers = getSessionUsers(sessionId);
    console.log(`Sending session users to ${userName}:`, sessionUsers);
    
    // Send current users to the new user
    socket.emit('session_users', sessionUsers);

    // Notify others that user joined
    socket.to(sessionId).emit('user_joined', {
      userName,
      timestamp: new Date()
    });

    // Log current sessions
    logSessions();
  });

  // Handle messages
  socket.on('send_message', async ({ content }) => {
    if (!currentSession) return;

    console.log(`Message from ${currentUser} in session ${currentSession}: ${content.substring(0, 20)}${content.length > 20 ? '...' : ''}`);
    
    const message = {
      id: Date.now(),
      sender: currentUser,
      content,
      timestamp: new Date()
    };

    // Store message in session history
    if (!sessions[currentSession].messages) {
      sessions[currentSession].messages = [];
    }
    sessions[currentSession].messages.push(message);

    // Send message to all OTHER users in the session (not back to sender)
    socket.to(currentSession).emit('receive_message', message);

    // Check if there are at least 2 users in the session
    const userCount = Object.keys(sessions[currentSession].users).length;
    if (userCount >= 2) {
      // Simulate typing from "Pastor Grace"
      io.to(currentSession).emit('user_typing', { userName: 'Pastor Grace' });
      
      try {
        // Get AI response
        const aiResponse = await getAIResponse(
          content, 
          sessions[currentSession].messages.slice(-10) // Send last 10 messages as context
        );
        
        // Create AI message
        const aiMessage = {
          id: Date.now(),
          sender: 'Pastor Grace',
          content: aiResponse,
          timestamp: new Date()
        };
        
        // Add AI message to history
        sessions[currentSession].messages.push(aiMessage);
        
        // Wait a moment before sending the response (simulate typing)
        setTimeout(() => {
          // Make sure to stop typing indicator for all users
          io.to(currentSession).emit('user_stop_typing', { userName: 'Pastor Grace' });
          
          // Broadcast AI message to all users in the session
          io.to(currentSession).emit('receive_message', aiMessage);
          
          console.log(`AI response sent to all users in session ${currentSession}`);
        }, 1500);
      } catch (error) {
        console.error('Error handling AI response:', error);
      }
    }
  });

  // Handle typing indicators
  socket.on('typing', () => {
    if (!currentSession || !currentUser) return;

    console.log(`${currentUser} is typing in session ${currentSession}`);

    if (sessions[currentSession]?.users[socket.id]) {
      sessions[currentSession].users[socket.id].isTyping = true;
    }

    // Broadcast typing status to other users in session
    socket.to(currentSession).emit('user_typing', { userName: currentUser });
  });

  socket.on('stop_typing', () => {
    if (!currentSession || !currentUser) return;

    console.log(`${currentUser} stopped typing in session ${currentSession}`);

    if (sessions[currentSession]?.users[socket.id]) {
      sessions[currentSession].users[socket.id].isTyping = false;
    }

    // Broadcast stop typing to other users in session
    socket.to(currentSession).emit('user_stop_typing', { userName: currentUser });
  });

  // Handle client requesting current users
  socket.on('get_session_users', () => {
    if (!currentSession) return;
    
    const sessionUsers = getSessionUsers(currentSession);
    socket.emit('session_users', sessionUsers);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);

    if (currentSession && sessions[currentSession]) {
      // Remove user from session
      delete sessions[currentSession].users[socket.id];

      // Notify others that user left
      socket.to(currentSession).emit('user_left', {
        userName: currentUser,
        timestamp: new Date()
      });

      console.log(`${currentUser} left session ${currentSession}`);

      // Clean up empty sessions
      if (Object.keys(sessions[currentSession].users).length === 0) {
        console.log(`Removing empty session: ${currentSession}`);
        delete sessions[currentSession];
      }

      // Log current sessions
      logSessions();
    }
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
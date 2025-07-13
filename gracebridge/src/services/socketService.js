import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.sessionId = null;
    this.userName = null;
    this.callbacks = {
      connect: [],
      disconnect: [],
      receive_message: [],
      user_typing: [],
      user_stop_typing: [],
      user_joined: [],
      user_left: [],
      session_users: [],
      error: []
    };
  }

  // Initialize socket connection
  connect(sessionId, userName) {
    // Store session info
    this.sessionId = sessionId;
    this.userName = userName;
    
    // Don't create a new connection if one already exists
    if (this.socket) {
      console.log('Socket connection already exists, re-using existing connection');
      
      // If we're already connected, trigger connection events again
      if (this.connected) {
        console.log('Already connected, triggering connect event');
        this._trigger('connect');
        
        // Re-join session to ensure we're in the right room
        console.log(`Re-joining session ${sessionId} as ${userName}`);
        this.socket.emit('join_session', { sessionId, userName });
      }
      
      return this;
    }

    console.log(`Creating new socket connection for session ${sessionId} as ${userName}`);
    
    // Create socket connection
    this.socket = io('http://localhost:5000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });
    
    // Set up event listeners
    this.socket.on('connect', () => {
      console.log('Socket connected with ID:', this.socket.id);
      this.connected = true;
      this._trigger('connect');
      
      // Join session after connection is established
      console.log(`Joining session ${sessionId} as ${userName}`);
      this.socket.emit('join_session', { sessionId, userName });
    });
    
    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
      this.connected = false;
      this._trigger('disconnect');
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this._trigger('error', { message: 'Failed to connect to server' });
    });
    
    this.socket.on('receive_message', (message) => {
      console.log('Received message:', message);
      this._trigger('receive_message', message);
    });
    
    this.socket.on('user_typing', (data) => {
      console.log('User typing:', data);
      this._trigger('user_typing', data);
    });
    
    this.socket.on('user_stop_typing', (data) => {
      console.log('User stopped typing:', data);
      this._trigger('user_stop_typing', data);
    });
    
    this.socket.on('user_joined', (data) => {
      console.log('User joined:', data);
      this._trigger('user_joined', data);
    });
    
    this.socket.on('user_left', (data) => {
      console.log('User left:', data);
      this._trigger('user_left', data);
    });
    
    this.socket.on('session_users', (users) => {
      console.log('Session users:', users);
      this._trigger('session_users', users);
    });
    
    return this;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.sessionId = null;
      this.userName = null;
    }
  }

  // Check connection status
  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }

  // Request current session users
  getSessionUsers() {
    if (!this.socket || !this.connected) {
      console.error('Cannot get session users: Socket not connected');
      return false;
    }
    
    console.log('Requesting current session users');
    this.socket.emit('get_session_users');
    return true;
  }

  // Send message
  sendMessage(message) {
    if (!this.socket || !this.connected) {
      console.error('Cannot send message: Socket not connected');
      return false;
    }
    
    console.log('Sending message:', message);
    this.socket.emit('send_message', { content: message });
    return true;
  }

  // Send typing indicator
  sendTyping() {
    if (!this.socket || !this.connected) return;
    
    console.log('Sending typing indicator');
    this.socket.emit('typing');
  }

  // Send stop typing indicator
  sendStopTyping() {
    if (!this.socket || !this.connected) return;
    
    console.log('Sending stop typing indicator');
    this.socket.emit('stop_typing');
  }

  // Register event listeners
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
    return this;
  }

  // Remove event listeners
  off(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event] = this.callbacks[event].filter(cb => cb !== callback);
    }
    return this;
  }

  // Trigger event callbacks
  _trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} callback:`, error);
        }
      });
    }
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService; 
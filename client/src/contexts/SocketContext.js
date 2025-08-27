import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Create socket connection
      const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token')
        }
      });

      // Connection events
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        newSocket.close();
      };
    } else {
      // Disconnect if not authenticated
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  // Join analysis room
  const joinAnalysis = (analysisId) => {
    if (socket && isConnected) {
      socket.emit('join-analysis', analysisId);
    }
  };

  // Send chat message
  const sendChatMessage = (message, analysisId) => {
    if (socket && isConnected) {
      socket.emit('chat-message', { message, analysisId });
    }
  };

  // Listen for chat responses
  const onChatResponse = (callback) => {
    if (socket) {
      socket.on('chat-response', callback);
      
      // Return cleanup function
      return () => {
        socket.off('chat-response', callback);
      };
    }
  };

  // Listen for chat errors
  const onChatError = (callback) => {
    if (socket) {
      socket.on('chat-error', callback);
      
      // Return cleanup function
      return () => {
        socket.off('chat-error', callback);
      };
    }
  };

  const value = {
    socket,
    isConnected,
    joinAnalysis,
    sendChatMessage,
    onChatResponse,
    onChatError
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

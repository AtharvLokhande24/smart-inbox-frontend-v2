import { useEffect, useState, useCallback, useRef } from 'react';
import { subscribeToEmailStream, unsubscribeFromEmailStream } from '../services/api';

/**
 * Hook for subscribing to real-time email updates via SSE
 * @param {string} userId - User ID to stream emails for
 * @returns {Object} Stream state and control methods
 */
export const useEmailStream = (userId) => {
  const [isConnected, setIsConnected] = useState(false);
  const [newEmails, setNewEmails] = useState([]);
  const [streamError, setStreamError] = useState(null);
  const [stats, setStats] = useState({
    totalReceived: 0,
    lastUpdate: null,
    unreadSync: null,
    prioritySync: null
  });
  
  const eventSourceRef = useRef(null);

  const handleConnect = useCallback((data) => {
    console.log('[useEmailStream] Connected to stream:', data);
    setIsConnected(true);
    setStreamError(null);
    setStats(prev => ({
      ...prev,
      lastUpdate: new Date().toISOString()
    }));
  }, []);

  const handleNewEmails = useCallback((data) => {
    console.log('[useEmailStream] Received new emails:', data);
    if (data.emails && Array.isArray(data.emails)) {
      setNewEmails(prev => {
        // Avoid duplicates by checking mail_msg_id
        const existingIds = new Set(prev.map(e => e.mail_msg_id));
        const uniqueNewEmails = data.emails.filter(
          e => !existingIds.has(e.mail_msg_id)
        );
        return [...uniqueNewEmails, ...prev].slice(0, 100); // Keep last 100
      });

      setStats(prev => ({
        ...prev,
        totalReceived: prev.totalReceived + (data.count || 0),
        lastUpdate: data.emittedAt || new Date().toISOString(),
        unreadSync: data.unreadSync,
        prioritySync: data.prioritySync
      }));
    }
  }, []);

  const handleError = useCallback((error) => {
    console.error('[useEmailStream] Stream error:', error);
    setStreamError(error);
    setIsConnected(false);
  }, []);

  const clearEmails = useCallback(() => {
    setNewEmails([]);
  }, []);

  const closeStream = useCallback(() => {
    if (eventSourceRef.current) {
      unsubscribeFromEmailStream(eventSourceRef.current);
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      return;
    }

    console.log('[useEmailStream] Subscribing to stream for userId:', userId);
    
    // Subscribe to stream
    const eventSource = subscribeToEmailStream(
      userId,
      handleNewEmails,
      handleError,
      handleConnect
    );

    eventSourceRef.current = eventSource;

    // Cleanup on unmount
    return () => {
      console.log('[useEmailStream] Cleaning up stream');
      unsubscribeFromEmailStream(eventSource);
    };
  }, [userId, handleNewEmails, handleError, handleConnect]);

  return {
    isConnected,
    newEmails,
    streamError,
    stats,
    clearEmails,
    closeStream
  };
};

export default useEmailStream;

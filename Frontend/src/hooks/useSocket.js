// client/src/hooks/useSocket.js
import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = (boardId) => {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!boardId) return;

    // connect to the server
    socketRef.current = io('http://localhost:5000');

    // join this board's room
    socketRef.current.emit('join_board', boardId);

    // cleanup on unmount
    return () => {
      socketRef.current.emit('leave_board', boardId);
      socketRef.current.disconnect();
    };
  }, [boardId]);

  const emit = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event) => {
    if (socketRef.current) {
      socketRef.current.off(event);
    }
  };

  return { emit, on, off };
};

export default useSocket;
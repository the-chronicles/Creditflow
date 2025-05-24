import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const useNotificationsSocket = (onNewNotification: (note: any) => void) => {
  useEffect(() => {
    const token = localStorage.getItem('Token');
    if (!token) return;

    const socket: Socket = io('https://cash-flow-be.onrender.com', {
      transports: ['websocket'], // force pure WS
      auth: { token },
      withCredentials: true,     // optional, can be helpful on some CORS setups
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
    });

    socket.on('notification:new', (note) => {
      console.log('📩 New notification received:', note);
      onNewNotification(note);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
};

export default useNotificationsSocket;

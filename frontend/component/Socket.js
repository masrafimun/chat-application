import { io } from 'socket.io-client';

  const socket = io("https://chat-backend-vbqg.onrender.com", {
    withCredentials: true,
    autoConnect: false,
    transports: ['websocket']
  });

export default socket;

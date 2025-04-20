import { io } from 'socket.io-client';

  const socket = io("https://chat-backend-seven-pi.vercel.app", {
    withCredentials: true,
    autoConnect: false,
  
  });

export default socket;

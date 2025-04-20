import { io } from 'socket.io-client';

  const socket = io("https://chat-backend-vbqg.onrender.com", {
    withCredentials: true,
    autoConnect: false,
    transports: ['websocket']
  });

socket.on('connect_error', (err) => {
  console.error('Socket connection error:', err.message);
});
export default socket;

import { io } from 'socket.io-client';

/**
 * Socket.IO client configuration for real-time communication
 * Establishes WebSocket connection to the live chat server
 * Configured for optimal real-time messaging performance
 */
const socket = io("https://revenant.lyrica.systems", {
  path: "/livechat",
  transports: ["websocket"],
});

export default socket;
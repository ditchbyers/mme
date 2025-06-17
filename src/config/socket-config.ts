import { io } from 'socket.io-client';

const socket = io("https://revenant.lyrica.systems", {
  path: "/livechat",
  transports: ["websocket"],
});

export default socket;
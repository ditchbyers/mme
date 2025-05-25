const {io} = require('socket.io-client');

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

export default socket
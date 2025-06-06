const {io} = require('socket.io-client');

const socket = io('http://localhost:5000')

export default socket
import { io } from 'socket.io-client';

// 連線 Server 位置：
const socket = io('http://localhost:4000', {autoConnect: false})

export default socket;
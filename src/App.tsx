import { useEffect } from 'react'
import './App.css'
import { Button } from '@mui/material'
import { Outlet } from 'react-router-dom'
import socket from './socket'

function App() {

  const handleSocketConnection = () => {
    socket.connect();
  }

  const handleSend = () => {
    // Send Message To Server
    socket.emit('message', "String Value from Client!");
  }

  useEffect(() => {
    // 監聽：Send Upgrade Request
    socket.on('connect', () => {
      console.log("WebSocket is connected to server");
    });

    // 監聽：Receive Message From Server
    socket.on('message', (message) => {
      console.log(`Recieve Message: ${message}`);
    });

    return () => {
      socket.off('connect');
      socket.off('message');
      socket.disconnect();
    }
  }, [])

  return (
    <>
      <h1>WebSocket Demo</h1>
      <section className="card">
        <h2>系列一：推播範圍</h2>
        <Button variant="contained" color="primary" onClick={handleSocketConnection}>
          進入聊天室
        </Button>
        <Button variant="contained" color="primary" onClick={handleSend}>
          發送訊息
        </Button>
      </section>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App

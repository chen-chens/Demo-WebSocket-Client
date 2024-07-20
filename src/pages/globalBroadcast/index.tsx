import React, { useState, useEffect } from 'react'
import { TextField, Button, List, ListItem, Container, Typography } from '@mui/material'
import socket from '@/socket'

export default function GlobalBroadcastPage(){
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
  
    // useEffect(() => {
    //   socket.on('global-message', (msg) => {
    //     setMessages((prev) => [...prev, msg]);
    //   });
  
    //   return () => {
    //     socket.off('global-message');
    //   };
    // }, []);
  
    const sendMessage = () => {
    //   socket.emit('global-message', message);
    //   setMessage('');
    };
  
    return (
      <Container>
        <Typography variant="h4" gutterBottom>
          Global Broadcast
        </Typography>
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index}>{msg}</ListItem>
          ))}
        </List>
        <TextField
          variant="standard"
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
        />
        <Button onClick={sendMessage} variant="contained" color="primary">
          Send
        </Button>
      </Container>
    );
}
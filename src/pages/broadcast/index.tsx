import React, { useState, useEffect } from 'react'
import { TextField, Button, List, ListItem, Container, Typography, FormControl, InputLabel, Select, MenuItem, Box, Grid, Divider, Card } from '@mui/material'

export default function BroadcastPage(){
    const [globalMessage, setGlobalMessage] = useState('');
    const [groupMessage, setGroupMessage] = useState('');
    const [privateMessage, setPrivateMessage] = useState('');

    const [messages, setMessages] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
  
    // useEffect(() => {
    //     socket.on('ReceiveGlobalMessage', (message) => {
    //     setMessages((prev) => [...prev, { type: 'global', message }]);
    //     });

    //     socket.on('ReceiveGroupMessage', (message) => {
    //     setMessages((prev) => [...prev, { type: 'group', message }]);
    //     });

    //     socket.on('ReceivePrivateMessage', (message) => {
    //     setMessages((prev) => [...prev, { type: 'private', message }]);
    //     });

    //     return () => {
    //     socket.off('ReceiveGlobalMessage');
    //     socket.off('ReceiveGroupMessage');
    //     socket.off('ReceivePrivateMessage');
    //     };
    // }, []);


    const sendGlobalMessage = () => {
      // socket.emit('SendGlobalMessage', globalMessage);
      // setGlobalMessage('');
    };
  
    const sendGroupMessage = () => {
      // socket.emit('SendGroupMessage', selectedGroup, groupMessage);
      // setGroupMessage('');
    };
  
    const sendPrivateMessage = () => {
      // socket.emit('SendPrivateMessage', selectedUser, privateMessage);
      // setPrivateMessage('');
    };
  
    return (
      <Container>
        <Grid container spacing={10}>
          <Grid item xs={12} md={8}>
            <Box mb={5}>
              {/* Global Broadcast */}
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
                value={globalMessage}
                onChange={(e) => setGlobalMessage(e.target.value)}
                fullWidth
              />
              <Button onClick={sendGlobalMessage} variant="contained" color="primary">
                Send
              </Button>
            </Box>

            <Box mb={5}>
              {/* Group Broadcast */}
              <Typography variant="h4">Group Broadcast</Typography>
              <FormControl fullWidth>
                  <InputLabel>Group</InputLabel>
                  <Select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                  <MenuItem value="group1">Group 1</MenuItem>
                  <MenuItem value="group2">Group 2</MenuItem>
                  </Select>
              </FormControl>
              <TextField
                  variant="outlined"
                  label="Message"
                  value={groupMessage}
                  onChange={(e) => setGroupMessage(e.target.value)}
                  fullWidth
              />
              <Button onClick={sendGroupMessage} variant="contained" color="primary">Send</Button>
            </Box>
        
            <Box mb={5}>
              {/* One-to-One Chat */}
              <Typography variant="h4">One-to-One Chat</Typography>
              <FormControl fullWidth>
                  <InputLabel>User</InputLabel>
                  <Select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                  >
                  <MenuItem value="user1">User 1</MenuItem>
                  <MenuItem value="user2">User 2</MenuItem>
                  </Select>
              </FormControl>
              <TextField
                  variant="outlined"
                  label="Message"
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  fullWidth
              />
            
              <Button onClick={sendPrivateMessage} variant="contained" color="primary">Send</Button>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card variant="outlined">
                {/* Messages Display */}
                <List>
                  <ListItem key={123}>TEST</ListItem>
                    {messages.map((msg, index) => (
                    <ListItem key={index}>
                        <Typography variant="body1">
                            {/* {msg.type === 'global' ? `[Global] ${msg.message}` :
                            msg.type === 'group' ? `[Group] ${msg.message}` :
                            `[Private] ${msg.message}`} */}
                            #{index}. / {msg}
                        </Typography>
                    </ListItem>
                    ))}
                </List>
              </Card>
          </Grid>
        </Grid>
      </Container>
    );
}
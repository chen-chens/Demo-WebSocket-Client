import { useEffect, useState } from 'react'
import './App.css'
import { Box, Button, Card, CardContent, Container, Divider, Grid, TextField, Typography } from '@mui/material'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { HubConnection } from '@microsoft/signalr'
import { createConnection } from './signalRConnection'
import { BaseObject } from './types'

import CatIcon from '/cat.svg'; 
import DogIcon from '/dog.svg'; 

function App() {
  const groupList = [
    {
      id: "cat",
      name: "貓派",
      icon: CatIcon
    },
    {
      id: "dog",
      name: "狗派",
      icon: DogIcon
    },
  ];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<HubConnection|null>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);

  const [currentUser, setCurrentUser] = useState('');
  const [currentGroups, setCurrentGroups] = useState<BaseObject[]>([]);


  const handleConnection = async() => {
    setLoading(true);
    try{
      const initConnection = createConnection();
      setConnection(initConnection);
      // 建立連線
      const con = await initConnection.start();
      console.log("SignalR connects successfully!", con);
      setConnectionStatus(true);
    }catch(error){
      console.log("handleConnection Fail: ", error);
      setConnectionStatus(false);
      alert("SignalR connects failurely!");
    }finally{
      setLoading(false);
    }
  }

  return (
    <>
      <Container>
        <Typography variant='h2' gutterBottom>WebSocket Demo</Typography>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          label="Name"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
        />
        
        <Grid container spacing={2} my={2}>
          {groupList.map(item => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card elevation={3}>
                <CardContent>
                 
                  <Box><img src={item.icon} alt={item.name} /></Box>
                  <Typography variant='h4' gutterBottom>{item.name}</Typography>
             
                  {
                      currentGroups.some(group => group.id === item.id)
                      ? (
                          <Button 
                            variant="contained"
                            disabled
                          >
                            已加入
                          </Button>
                      ) : (
                          <Button 
                            onClick={() => setCurrentGroups([...currentGroups, item])} 
                            variant="outlined"
                            color="success"
                          >
                            加入群組
                          </Button>
                      )
                    }
                </CardContent>

              </Card>
            </Grid>
          ))}
        </Grid>

        <Button 
          fullWidth
          variant="contained" 
          color="inherit" 
          onClick={() => navigate('/demo')}
        >
          進入聊天室
        </Button>
      </Container>
      
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App

import './App.css'
import { useState } from 'react'
import { Box, Button, Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { groupList } from './mock'
import { useConnection } from './contexts/ConnectionProvider'
import { HubConnectionState } from '@microsoft/signalr'
import { OnlineUserInfo } from './types'
import { v4 as uuidv4 } from 'uuid';

function App() {
  const navigate = useNavigate();
  const { connection, connectionState } = useConnection();
  const [currentUser, setCurrentUser] = useState('');
  const [currentGroupIds, setCurrentGroupIds] = useState<string[]>([]);

  const handleJoinGroup = async (groupIds: string[]) => {
    if(!connection || connectionState !== HubConnectionState.Connected){
      alert("尚未進入聊天室！");
      return;
    }

    try{
      await connection.invoke("JoinGroup", groupIds);
      alert("JoinGroup: " + groupIds.join(","));
    }catch(error){
      console.log("handleJoinGroup error: ", error);
      alert("Join Group failurely!");
    }
  }

  const handleEnterChatRoom = async () => {
    if(!connection || connectionState !== HubConnectionState.Connected){
      alert("尚未建立連線！");
      return;
    }
    try{
      const userInfo: OnlineUserInfo = {
        id: uuidv4(),
        name: currentUser,
        groups: currentGroupIds,
      };

      await connection.invoke("NoticeUserLogIn", userInfo);
      await handleJoinGroup(currentGroupIds);
      navigate(`/demoA?userName=${currentUser}&userId=${uuidv4()}&groups=${currentGroupIds.join(",")}`);
    }catch(error){
      console.log("handleEnterChatRoom error: ", error);
      alert("進入聊天室失敗！")
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
                      currentGroupIds.some(groupId => groupId === item.id)
                      ? (
                          <Button 
                            variant="contained"
                            disabled
                          >
                            已加入
                          </Button>
                      ) : (
                          <Button 
                            onClick={() => setCurrentGroupIds([...currentGroupIds, item.id])} 
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
          onClick={() => handleEnterChatRoom()}
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

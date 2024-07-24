import './App.css'
import { useState } from 'react'
import { Box, Button, Card, CardContent, Container, Grid, TextField, Typography } from '@mui/material'
import { Outlet, useNavigate } from 'react-router-dom'
import { groupList } from './mock'

function App() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState('');
  const [currentGroupIds, setCurrentGroupIds] = useState<string[]>([]);

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
          onClick={() => navigate(`/demo?name=${currentUser}&groups=${currentGroupIds.join(",")}`)}
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

import { useEffect, useState } from 'react'
import './App.css'
import { Box, Button, Card, Container, Divider, Grid, List, ListItem, TextField, Typography } from '@mui/material'
import { Outlet, Link } from 'react-router-dom'
import { HubConnection } from '@microsoft/signalr'
import { createConnection } from './signalRConnection'
import dayjs from 'dayjs'


interface MessageType {
  user: string;
  traceId: string;
  content: string;
  time: string;
}
function App() {
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<HubConnection|null>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);

  // 訊息輸入：
  const [globalMessage, setGlobalMessage] = useState('');
  const [groupMessage, setGroupMessage] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');

  // 紀錄訊息列表：
  const [globalMessages, setGlobalMessages] = useState<MessageType[]>([]);
  const [groupMessages, setGroupMessages] = useState<MessageType[]>([]);
  const [privateMessages, setPrivateMessages] = useState<MessageType[]>([]);

  const handleConnection = async() => {
    setLoading(true);
    try{
      const initConnection = createConnection();
      setConnection(initConnection);
      // 建立連線
      await initConnection.start();
      console.log("SignalR connects successfully!");
      setConnectionStatus(true);
    }catch(error){
      console.log("handleConnection Fail: ", error);
      setConnectionStatus(false);
      alert("SignalR connects failurely!");
    }finally{
      setLoading(false);
    }
  }

  const handleSend = async () => {
    if(!connectionStatus || !connection){
      alert("尚未進入聊天室！");
      return;
    }
    
    try{
      // Send Message To Server
      const message = JSON.stringify({
        traceId: new Date().getTime(),
        content: "抓 input 資料！",
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      });

      await connection.send('message', "userA", message);
    }catch(error){
      console.log("HandleSend Fail: ", error);
      alert("Send Message failurely!");
    }
  }

  useEffect(() => {
    if(!connectionStatus || !connection){
      return;
    }

    const handleGlobalMessage = (user: string, data: string) => {
      const record = JSON.parse(data);
      setGlobalMessages(prev => [...prev, { user, ...record }]);
    };

    const handleGroupMessage = (user: string, data: string) => {
      const record = JSON.parse(data);
      setGroupMessages(prev => [...prev, { user, ...record }]);
    };

    const handlePrivateMessage = (user: string, data: string) => {
      const record = JSON.parse(data);
      setPrivateMessages(prev => [...prev, { user, ...record }]);
    };

    // 建立監聽：GlobalMessage
    connection.on('Receive: globalMessage', handleGlobalMessage)

    // 建立監聽：GroupMessage
    connection.on('Receive: groupMessage', handleGroupMessage)

    // 建立監聽：1on1 Message
    connection.on('Receive: privateMessage', handlePrivateMessage)

    return () => {
      // 停止監聽
      connection.off('Receive: globalMessage', handleGlobalMessage)
      connection.off('Receive: groupMessage', handleGroupMessage)
      connection.off('Receive: privateMessage', handlePrivateMessage)
      // 關閉連線
      connection.stop();
    }
  }, [connectionStatus])

  return (
    <>
      <h1>WebSocket Demo</h1>
      <section className="card">
        {/* <h2>系列一：推播範圍</h2> */}
        {/* <Link to={'/broadcast'}>Broad</Link> */}

        <Button variant="contained" color="primary" onClick={handleConnection}>
          進入聊天室
        </Button>
        <h3>目前連線狀態：{connectionStatus ? "連線中" : "尚未連線"}</h3>
      </section>
      <Divider />

      <Container>
        <Grid container spacing={10} p={2}>
          <Grid item xs={12} md={6}>
            <Box mb={5} p={1}>
              {/* Global Broadcast */}
              <Typography variant="h4" gutterBottom>
                Global Broadcast
              </Typography>
  
              <TextField
                variant="standard"
                label="Message"
                value={globalMessage}
                onChange={(e) => setGlobalMessage(e.target.value)}
                fullWidth
              />
              <Button onClick={handleSend} variant="contained" color="primary">
                發送訊息
              </Button>
              
            </Box>
          </Grid>

          {/* Messages Display */}
          <Grid item xs={12} md={6}>
            <Card>

                <Card key={123} variant="outlined" style={{margin: 10}}>
                    <p>
                      [2024-10-28] User : Content
                      / <span>{new Date().getTime()}</span>
                    </p>
                </Card>

                {globalMessages.map((item, index) => (
                  <Card key={index} variant="outlined">
                    <p>
                      [{item.time}] {item.user} : {item.content}
                      / <span>{item.traceId}</span>
                    </p>
                  </Card>
                ))}

            </Card>
          </Grid>
          
        </Grid>
      </Container>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App

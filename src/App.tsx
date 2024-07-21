import { useEffect, useState } from 'react'
import './App.css'
import { Button, TextField } from '@mui/material'
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

  const [globalMessage, setGlobalMessage] = useState<MessageType>();
  const [groupMessage, setGroupMessage] = useState<MessageType>();
  const [privateMessage, setPrivateMessage] = useState<MessageType>();

  // 紀錄訊息列表：
  const [globalMessages, setGlobalMessages] = useState<MessageType[]>([]);
  const [groupMessages, setGroupMessages] = useState<MessageType[]>([]);
  const [privateMessages, setPrivateMessages] = useState<MessageType[]>([]);

  const handleConnection = async() => {
    setLoading(true);
    try{
      const initConnection = createConnection();
      setConnection(initConnection);

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
      connection.off('Receive: globalMessage', handleGlobalMessage)
      connection.off('Receive: groupMessage', handleGroupMessage)
      connection.off('Receive: privateMessage', handlePrivateMessage)
      connection.stop();
    }
  }, [connectionStatus])

  return (
    <>
      <h1>WebSocket Demo</h1>
      <section className="card">
        <h2>系列一：推播範圍</h2>
        <Link to={'/broadcast'}>Broad</Link>

        <Button variant="contained" color="primary" onClick={handleConnection}>
          進入聊天室
        </Button>
        <Button variant="contained" color="primary" onClick={handleSend}>
          發送訊息
        </Button>
        <TextField
          variant="standard"
          label="Message"
          // value={globalMessage}
          // onChange={(e) => setGlobalMessage(e.target.value)}
          fullWidth
        />
      </section>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App

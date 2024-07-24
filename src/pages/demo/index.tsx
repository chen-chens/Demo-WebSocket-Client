import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { Box, Button, Card, Container, Divider, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import { HubConnection } from '@microsoft/signalr'
import { createConnection } from '@/signalRConnection'
import ChatList from '@/components/chatList'
import { BaseObject, BroadCastType, GroupMessageType, MessageType, PrivateMessageType } from '@/types'
import SendIcon from '@mui/icons-material/Send';

function DemoPage() {
  const groupList = [
    {
      id: "cat",
      name: "貓派",
    },
    {
      id: "dog",
      name: "狗派",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [connection, setConnection] = useState<HubConnection|null>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);

  const [currentUser, setCurrentUser] = useState('');
  const [currentGroup, setCurrentGroup] = useState<BaseObject>();

  // 訊息輸入：
  const [globalMessage, setGlobalMessage] = useState('');
  const [groupMessage, setGroupMessage] = useState('');
  const [privateMessage, setPrivateMessage] = useState('');

  // 紀錄訊息列表：
  const [globalMessages, setGlobalMessages] = useState<MessageType[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupMessageType[]>([]);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessageType[]>([]);


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

  const handleBasicMessage = (content: string): MessageType => {
    const message: MessageType = {
      user: currentUser,
      traceId: `${new Date().getTime()}`,
      content,
      createdTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };

    return message;
  }

  const handleJoinGroup = async (groupId: string) => {
    if(!connectionStatus || !connection){
      alert("尚未進入聊天室！");
      return;
    }

    try{
      await connection.invoke("JoinGroup", groupId);
      alert("JoinGroup: " + groupId);
    }catch(error){
      console.log("handleJoinGroup error: ", error);
      alert("Join Group failurely!");
    }
  }

  const handleLeaveGroup = async (groupId: string) => {
    if(!connectionStatus || !connection){
      alert("尚未進入聊天室！");
      return;
    }

    try{
      await connection.invoke("LeaveGroup", groupId);
      alert("LeaveGroup: " + groupId);
    }catch(error){
      console.log("handleLeaveGroup error: ", error);
      alert("Leave Group failurely!");
    }
  }

  const handleSendGroupMessage = async () => {
    if(!connectionStatus || !connection){
      alert("尚未進入聊天室！");
      return;
    }
    if(!currentGroup){
      alert("尚未選擇群組！");
      return;
    }

    try{
      const basicMessage = handleBasicMessage(groupMessage);
      const message: GroupMessageType = {
        ...basicMessage,
        groupName: currentGroup.name,
        groupId: currentGroup.id,
      };
      await connection.invoke('SendGroupMessage', currentGroup.id, message);

      setGroupMessage('');
      setCurrentGroup(undefined);
    }catch(error){
      console.log("handleSendGroupMessage error: ", error);
      alert("Send Group Message failurely!");
    }
  }

  const handleSendGlobalMessage = async () => {
    if(!connectionStatus || !connection){
      alert("尚未進入聊天室！");
      return;
    }
    
    try{
      // Send Message To Server
      const message: MessageType = handleBasicMessage(globalMessage);
      await connection.invoke('SendGlobalMessage', message);

      setGlobalMessage('');
    }catch(error){
      console.log("handleSendGlobalMessage error: ", error);
      alert("Send Global Message failurely!");
    }
  }

  useEffect(() => {
    if(!connectionStatus || !connection){
      return;
    }

    const handleGlobalMessage = (data: string) => {
      const record = JSON.parse(data);
      setGlobalMessages(prev => [...prev, { ...record }]);
    };

    const handleGroupMessage = (data: string) => {
      console.log("🚀 ~ handleGroupMessage ~ data:", data)
      const record = JSON.parse(data);
      setGroupMessages(prev => [...prev, { ...record }]);
    };

    const handlePrivateMessage = (data: string) => {
      const record = JSON.parse(data);
      setPrivateMessages(prev => [...prev, { ...record }]);
    };

    // 建立監聽：GlobalMessage
    connection.on('GlobalMessage', handleGlobalMessage)

    // 建立監聽：GroupMessage
    connection.on('GroupMessage', handleGroupMessage)

    // 建立監聽：1on1 Message
    connection.on('PrivateMessage', handlePrivateMessage)

    return () => {
      // 停止監聽
      connection.off('GlobalMessage', handleGlobalMessage)
      connection.off('GroupMessage', handleGroupMessage)
      connection.off('PrivateMessage', handlePrivateMessage)
      // 關閉連線
      connection.stop();
    }
  }, [connectionStatus])

  return (
    <>
      <h1>WebSocket Demo</h1>
      <h3>目前連線狀態：{connectionStatus ? "連線中" : "尚未連線"}</h3>

      <Container>
        {/* <h2>系列一：推播範圍</h2> */}
        {/* <Link to={'/broadcast'}>Broad</Link> */}

        <TextField
          variant="outlined"
          label="Name"
          value={currentUser}
          onChange={(e) => setCurrentUser(e.target.value)}
          
        />
        <Button variant="contained" color="primary" onClick={handleConnection} >
          加入
        </Button>
        <Container>
        <Grid container spacing={10} p={2}>
          {groupList.map(item => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card variant="elevation" style={{margin: 10, padding: 10}}>
                <h4>{item.name}</h4>

                <Button 
                  onClick={() => handleJoinGroup(item.id)} 
                  variant="contained"
                  color="success"
                >
                  加入群組
                </Button>

                <Button 
                  onClick={() => handleLeaveGroup(item.id)} 
                  variant="contained"
                  color="warning"
                >
                  離開群組
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
        </Container>
      </Container>

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
                variant="outlined"
                label="Message"
                value={globalMessage}
                onChange={(e) => setGlobalMessage(e.target.value)}
                fullWidth
              />
              <Button 
                onClick={handleSendGlobalMessage} 
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
              >
                發送訊息
              </Button>
              
            </Box>
          </Grid>

          {/* Messages Display */}
          <Grid item xs={12} md={6}>
            <ChatList
              type={BroadCastType.GLOBAL}
              messages={globalMessages}
            />
          </Grid>
        </Grid>
      </Container>

      <Divider />

      <Container>
        <Grid container spacing={10} p={2}>
          <Grid item xs={12} md={6}>
          <Box mb={5}>
              {/* Group Broadcast */}
              <Typography variant="h4">Group Broadcast</Typography>
              <FormControl fullWidth>
                  <InputLabel>Group</InputLabel>
                  <Select
                      value={currentGroup}
                      onChange={(e: SelectChangeEvent<BaseObject>) => setCurrentGroup({
                        name: e.target.name,
                        id: e.target.value.toString()
                      })}
                  >
                    {groupList.map(item => (
                      <MenuItem value={item.id}>{item.name}</MenuItem>
                    ))}
                  </Select>
              </FormControl>
              <TextField
                  variant="outlined"
                  label="Message"
                  value={groupMessage}
                  onChange={(e) => setGroupMessage(e.target.value)}
                  fullWidth
              />
              <Button 
                onClick={handleSendGroupMessage} 
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
              >
                發送訊息
              </Button>

            </Box>
          </Grid>

          {/* Messages Display */}
          <Grid item xs={12} md={6}>
            <ChatList
              type={BroadCastType.GROUP}
              messages={groupMessages}
            />
          </Grid>
          
        </Grid>
      </Container>
    </>
  )
}

export default DemoPage

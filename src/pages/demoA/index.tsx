import { useEffect, useState } from 'react'
import { AppBar, Box, Button, Collapse, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, TextField, Toolbar, Typography } from '@mui/material'
import { 
  Send as SendIcon,
  Menu as MenuIcon, 
  ExpandLess, 
  ExpandMore
} from '@mui/icons-material';
import ChatList from '@/components/chatList';
import { BroadCastType, GroupMessageType, MessageType, PrivateMessageType } from '@/types';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import { createConnection } from '@/signalRConnection';
import handleBasicMessage from '@/utils/handleBasicMessage';
import { HubConnection } from '@microsoft/signalr';

function DemoAPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {name, groups} = qs.parse(location.search, { ignoreQueryPrefix: true, comma: true });

  // 側邊欄：
  const [groupOpen, setGroupOpen] = useState(true);
  const [privateOpen, setPrivateOpen] = useState(true);
  const [selectedBroadCast, setSelectedBroadCast] = useState<BroadCastType>(BroadCastType.GLOBAL);
  const [selectedTarget, setSelectedTarget] = useState<string>();
  
  const [onlineUsers, setOnlineUsers] = useState<string[]>(["個人訊息"]);
  const [currentGroups, setCurrentGroups] = useState<string[]>([]);

  // 連線：
  const [connection, setConnection] = useState<HubConnection|null>(null);
  const [connectionStatus, setConnectionStatus] = useState(false);

  // 訊息輸入：
  const [currentMessage, setCurrentMessage] = useState('');

  // 紀錄訊息列表：
  const [globalMessages, setGlobalMessages] = useState<MessageType[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupMessageType[]>([]);
  const [privateMessages, setPrivateMessages] = useState<PrivateMessageType[]>([]);

  // 切換聊天室
  const switchChannel = (type: BroadCastType, child?: string) => {
    if(child){
      setSelectedTarget(child);
    }else{
      setSelectedTarget(undefined);
    }
    switch(type){
      case BroadCastType.GROUP:
        !child && setGroupOpen(!groupOpen);
        setSelectedBroadCast(BroadCastType.GROUP);
        break;
      case BroadCastType.PRIVATE:
        !child && setPrivateOpen(!privateOpen);
        setSelectedBroadCast(BroadCastType.PRIVATE);
        break;
      default:
        setSelectedBroadCast(BroadCastType.GLOBAL);
    }
  };

  const switchMessageView = () => {

    return [];
  }

  // 切換發送訊息
  const switchSendMessage = () => {
    switch(selectedBroadCast){
      case BroadCastType.GROUP:

      break;

      case BroadCastType.PRIVATE:

      break;

      default:
        handleSendGlobalMessage();
    }
  }

  // const handleSendGroupMessage = async () => {
  //   if(!connectionStatus || !connection){
  //     alert("尚未進入聊天室！");
  //     return;
  //   }
  //   if(currentGroups.length === 0){
  //     alert("尚未選擇群組！");
  //     return;
  //   }

  //   try{
  //     const basicMessage = handleBasicMessage(`${name}`, groupMessage);
  //     const message: GroupMessageType = {
  //       ...basicMessage,
  //       groupName: currentGroup.name,
  //       groupId: currentGroup.id,
  //     };
  //     await connection.invoke('SendGroupMessage', currentGroup.id, message);

  //     setGroupMessage('');
  //     setCurrentGroup(undefined);
  //   }catch(error){
  //     console.log("handleSendGroupMessage error: ", error);
  //     alert("Send Group Message failurely!");
  //   }
  // }

  const handleSendGlobalMessage = async () => {
    if(!connectionStatus || !connection){
      alert("尚未進入聊天室！");
      return;
    }
    
    try{
      // Send Message To Server
      const message: MessageType = handleBasicMessage(`${name}`, currentMessage);
      await connection.invoke('SendGlobalMessage', message);

      setCurrentMessage('');
    }catch(error){
      console.log("handleSendGlobalMessage error: ", error);
      alert("Send Global Message failurely!");
    }
  }

  useEffect(() => {
    if(groups){
      if(Array.isArray(groups)){
        setCurrentGroups(groups.map(item => `${item}`));
      }else{
        setCurrentGroups([`${groups}`])
      }
    }
  }, [location.search])

  // 建立連線：
  useEffect(() => {
    const handleConnection = async() => {
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
      }
    };

    handleConnection();

    return () => {

    }
  }, [])

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
      <AppBar position="static">
        <Toolbar sx={{justifyContent: "space-between"}}>
          <Box sx={{display: "flex", alignItems: "center"}}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" component="div">
              WebSocket Demo
            </Typography>
          </Box>
          <Box sx={{display: "flex", alignItems: "center"}}>
            <Typography variant="h6" sx={{mr: 2}}>
              {`${name}`}
            </Typography>
            <Button 
              color="info" 
              type="button" 
              variant="outlined" 
              onClick={() => navigate('/')}
            >
              離開聊天室
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Grid container style={{height: "calc(100vh - 64px)"}}>
        <Grid item xs={12} md={2}>
            {/* 左邊群組列表 */}
            <List
              sx={{ 
                height: "calc(100vh - 64px)",
                bgcolor: 'background.paper', 
                borderRight: "1px solid #282828" ,
                textAlign: 'left'
              }}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  <Typography variant="subtitle1" component="span">
                    目前連線狀態：
                      {/* {
                        connectionStatus 
                        ? "連線中" 
                        : "尚未連線"
                      } */}
                  </Typography>
                </ListSubheader>
              }
            >
    {/* Global */}
              <ListItemButton onClick={() => switchChannel(BroadCastType.GLOBAL)}>
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText primary="Global" />
              </ListItemButton>

    {/* Group */}
              <ListItemButton onClick={() => switchChannel(BroadCastType.GROUP)}>
                <ListItemIcon>
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText primary="Group" />
                {groupOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={groupOpen} timeout="auto" unmountOnExit>
                {currentGroups.map(item => (
                    <List component="div" disablePadding key={`${item}`}>
                      <ListItemButton onClick={() => switchChannel(BroadCastType.GROUP, item)}>
                        <ListItemText primary={`${item}`} inset />
                      </ListItemButton>
                    </List>
                  ))
                }
              </Collapse>

    {/* Private */}
              <ListItemButton onClick={() => switchChannel(BroadCastType.PRIVATE)}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Private" />
                {privateOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={privateOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {onlineUsers.map(item => (
                    <ListItemButton onClick={() => switchChannel(BroadCastType.PRIVATE, item)}>
                      <ListItemText primary={item} inset />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
        </Grid>

        {/* Messages Display */}
        <Grid item xs={12} md={10} style={{position: "relative"}}>
          <ChatList
            type={selectedBroadCast}
            title={selectedTarget}
            messages={switchMessageView()}
          />

          <Box sx={{position: "absolute", bottom: 10, left: 20, right: 20, display: "flex"}}>
            <TextField
                variant="outlined"
                label="Message"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                fullWidth
            />
            <Button 
              onClick={switchSendMessage}
              variant="contained"
              color="primary"
            >
              <SendIcon />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DemoAPage

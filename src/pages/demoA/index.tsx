import { useEffect, useState } from 'react'
import { AppBar, Box, Button, Collapse, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, TextField, Toolbar, Typography } from '@mui/material'
import { 
  Send as SendIcon,
  Menu as MenuIcon, 
  ExpandLess, 
  ExpandMore
} from '@mui/icons-material';
import ChatList from '@/components/chatList';
import { BaseObject, BroadCastType, GroupMessageListType, GroupMessageType, MessageType, OnlineUserInfo, PrivateMessageListType, PrivateMessageType } from '@/types';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import { useLocation, useNavigate } from 'react-router-dom';
import qs from 'qs';
import handleBasicMessage from '@/utils/handleBasicMessage';
import { HubConnectionState } from '@microsoft/signalr';
import { useConnection } from '@/contexts/ConnectionProvider';
import { v4 as uuidv4 } from 'uuid';
import { groupList } from '@/mock';

function DemoAPage() {
  const initUser: OnlineUserInfo = {
    id: uuidv4(),
    name: '個人訊息',
    groups: ['cat', 'dog']
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { connection, connectionState } = useConnection();
  const {userName, userId, groups} = qs.parse(location.search, { ignoreQueryPrefix: true, comma: true });

  // 側邊欄：
  const [groupOpen, setGroupOpen] = useState(true);
  const [privateOpen, setPrivateOpen] = useState(true);
  const [selectedBroadCast, setSelectedBroadCast] = useState<BroadCastType>(BroadCastType.GLOBAL);
  const [selectedTarget, setSelectedTarget] = useState<BaseObject>();
  
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserInfo[]>([initUser]);
  const [currentGroups, setCurrentGroups] = useState<BaseObject[]>([]);
  const [notice, setNotice] = useState<string>();

  // 訊息輸入：
  const [currentMessage, setCurrentMessage] = useState('');

  // 紀錄訊息列表：
  const [globalMessages, setGlobalMessages] = useState<MessageType[]>([]);
  const [groupMessages, setGroupMessages] = useState<GroupMessageListType>({});
  console.log("🚀 ~ DemoAPage ~ groupMessages:", groupMessages)
  const [privateMessages, setPrivateMessages] = useState<PrivateMessageListType>({});

  // 切換聊天室
  const switchChannel = (type: BroadCastType, child?: BaseObject) => {
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

  const switchMessageView = (targetId: string = "") => {
    switch(selectedBroadCast){
      case BroadCastType.GLOBAL:
        return globalMessages;

      case BroadCastType.GROUP:
        return groupMessages[targetId];

      case BroadCastType.PRIVATE:
        return privateMessages[targetId];

      default:
        return [];
    }
  }

  // 切換發送訊息
  const switchSendMessage = () => {
    switch(selectedBroadCast){
      case BroadCastType.GROUP:
        handleSendGroupMessage();
      break;

      case BroadCastType.PRIVATE:
        handleSendPrivateMessage();
      break;

      default:
        handleSendGlobalMessage();
    }
  }

  const handleSendPrivateMessage = async () => {
    if(!connection || connectionState !== HubConnectionState.Connected){
      alert("尚未進入聊天室！");
      return;
    }

    try{
      const basicMessage = handleBasicMessage(`${userName}`, `${userId}`, currentMessage);
      const message: PrivateMessageType = {
        ...basicMessage,
        // toUserName: currentGroup.name,
        toUserId: selectedTarget?.id||"",
      };
      await connection.invoke('SendPrivateMessage', selectedTarget||"", message);

      setCurrentMessage('');
    }catch(error){
      console.log("handleSendPrivateMessage error: ", error);
      alert("Send Private Message failurely!");
    }
  }

  const handleSendGroupMessage = async () => {
    if(!connection || connectionState !== HubConnectionState.Connected){
      alert("尚未進入聊天室！");
      return;
    }
    if(currentGroups.length === 0){
      alert("尚未選擇群組！");
      return;
    }

    try{
      const basicMessage = handleBasicMessage(`${userName}`, `${userId}`, currentMessage);
      const message: GroupMessageType = {
        ...basicMessage,
        groupName: selectedTarget?.name||"",
        groupId: selectedTarget?.id||"",
      };
      await connection.invoke('SendGroupMessage', selectedTarget?.id||"", message);

      setCurrentMessage('');
    }catch(error){
      console.log("handleSendGroupMessage error: ", error);
      alert("Send Group Message failurely!");
    }
  }

  const handleSendGlobalMessage = async () => {
    if(!connection || connectionState !== HubConnectionState.Connected){
      alert("尚未進入聊天室！");
      return;
    }
    
    try{
      // Send Message To Server
      const message: MessageType = handleBasicMessage(`${userName}`, `${userId}`, currentMessage);
      await connection.invoke('SendGlobalMessage', message);

      setCurrentMessage('');
    }catch(error){
      console.log("handleSendGlobalMessage error: ", error);
      alert("Send Global Message failurely!");
    }
  }

  useEffect(() => {
    if(groups){
      let groupIds = [];
      if(Array.isArray(groups)){
        groupIds = groups.map(item => `${item}`);
      }else{
        groupIds =[`${groups}`]
      }

      setCurrentGroups(groupIds.map(id => ({
          id, 
          name: groupList.find(group => group.id === id)?.name||""
        })
      ));

      const initGroupMessages: GroupMessageListType = {};
      groupIds.forEach(id => {
        if(initGroupMessages[id]){
          return;
        }
        initGroupMessages[id] = []
      })
      setGroupMessages(initGroupMessages);

      setPrivateMessages({
          [`${userId}`]: []
      });
    }
  }, [location.search])

  useEffect(() => {
    if(!connection || connectionState !== HubConnectionState.Connected){
      return;
    }

    const handleOnlineUsers = (data: string) => {
      const record: OnlineUserInfo = JSON.parse(data);
      setOnlineUsers(prev => [...prev, record]);
      setNotice(`${record.name} 加入聊天室！`);

      setPrivateMessages((prev) => {
        return({
          ...prev,
          [record.id]: [],
          [`${userId}`]: []
        })
      });
    };

    const handleGlobalMessage = (data: string) => {
      const record: GroupMessageType = JSON.parse(data);
      setGlobalMessages(prev => [...prev, record]);
    };

    // 前端沒接收到
    const handleGroupMessage = (data: string) => {
      console.log("🚀 ~ handleGroupMessage ~ data:", data)
      const record: GroupMessageType = JSON.parse(data);
      console.log("🚀 ~ handleGroupMessage ~ record:", record)

      setGroupMessages(prev => {
        if(prev && prev[record.groupId]){
          prev[record.groupId].push(record);
          return ({...prev});
        }
        else{
          prev[record.groupId] = [record];
          return ({...prev});
        }
      });
    };

    const handlePrivateMessage = (data: string) => {
      const record: PrivateMessageType = JSON.parse(data);
      setPrivateMessages(prev => {
        if(prev && prev[record.fromUserId]){
          prev[record.toUserId].push(record);
          return ({...prev});
        }
        else{
          prev[record.fromUserId] = [record];
          return ({...prev});
        }
      });
    };

    // 建立監聽：其他人加入聊天室
    connection.on('UserLogIn', handleOnlineUsers)
    
    // 建立監聽：GlobalMessage
    connection.on('GlobalMessage', handleGlobalMessage)

    // 建立監聽：GroupMessage
    connection.on('GroupMessage', handleGroupMessage)

    // 建立監聽：1on1 Message
    connection.on('PrivateMessage', handlePrivateMessage)

    return () => {
      // 停止監聽
      connection.off('UserLogIn', handleOnlineUsers)
      connection.off('GlobalMessage', handleGlobalMessage)
      connection.off('GroupMessage', handleGroupMessage)
      connection.off('PrivateMessage', handlePrivateMessage)
    }
  }, [connection, connectionState])
  
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
              {`${userName}`}
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
                    目前連線狀態：{connectionState}
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
                    <List component="div" disablePadding key={`${item.id}`}>
                      <ListItemButton onClick={() => switchChannel(BroadCastType.GROUP, item)}>
                        <ListItemText primary={`${item.name}`} inset />
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
                    <ListItemButton key={item.id} onClick={() => switchChannel(BroadCastType.PRIVATE, item)}>
                      <ListItemText primary={item.name} inset />
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
            title={selectedTarget?.name}
            notice={notice}
            messages={switchMessageView(selectedTarget?.id)}
            currentUser={{
              userId: `${userId}`,
              userName: `${userName}`
            }}
          />

          <Box sx={{position: "absolute", bottom: 10, left: 20, right: 20, display: "flex"}}>
            <TextField
                variant="outlined"
                label="Message"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault(); // 防止表單提交
                    switchSendMessage();
                  }
                }}
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

import { useState } from 'react'
import { AppBar, Box, Button, Collapse, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Stack, TextField, Toolbar, Typography } from '@mui/material'
import { 
  Send as SendIcon,
  Menu as MenuIcon, 
  Inbox as InboxIcon,
  StarBorder, 
  ExpandLess, 
  ExpandMore
} from '@mui/icons-material';
import ChatList from '@/components/chatList';
import { BroadCastType } from '@/types';
import PublicIcon from '@mui/icons-material/Public';
import GroupsIcon from '@mui/icons-material/Groups';
import PersonIcon from '@mui/icons-material/Person';
import ThreePIcon from '@mui/icons-material/ThreeP';

function DemoAPage() {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

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
          <Box>
            <Typography variant="subtitle1" component="span">
              目前連線狀態：
                {/* {
                  connectionStatus 
                  ? "連線中" 
                  : "尚未連線"
                } */}
            </Typography>
          </Box>
          {/* <Button color="inherit">Login</Button> */}
        </Toolbar>
      </AppBar>
      
      <Grid container style={{height: "calc(100vh - 64px)"}}>
        <Grid item xs={12} md={2}>
      
            {/* 左邊群組列表 */}
            <List
              sx={{ 
                height: "calc(100vh - 64px)",
                bgcolor: 'background.paper', 
                borderRight: "1px solid #282828" 
              }}
              
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  這裡放搜尋輸入
                </ListSubheader>
              }
            >
    {/* Global */}
              <ListItemButton>
                <ListItemIcon>
                  <PublicIcon />
                </ListItemIcon>
                <ListItemText primary="Global" />
              </ListItemButton>

    {/* Group */}
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <GroupsIcon />
                </ListItemIcon>
                <ListItemText primary="Group" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="社群訊息" inset />
                  </ListItemButton>
                </List>
              </Collapse>

    {/* Private */}
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Private" />
                {open ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemText primary="個人訊息" inset />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
        </Grid>

        {/* Messages Display */}
        <Grid item xs={12} md={10} style={{position: "relative"}}>
          <ChatList
            type={BroadCastType.GLOBAL}
            messages={[]}
          />

          <Box sx={{position: "absolute", bottom: 10, left: 20, right: 20, display: "flex"}}>
            <TextField
                variant="outlined"
                label="Message"
                // value={groupMessage}
                // onChange={(e) => setGroupMessage(e.target.value)}
                fullWidth
            />
            <Button 
              // onClick={handleSendGroupMessage} 
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

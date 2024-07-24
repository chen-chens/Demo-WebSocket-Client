import { useState } from 'react'
import { AppBar, Box, Collapse, Container, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Toolbar, Typography } from '@mui/material'
import { 
  Send as SendIcon,
  Menu as MenuIcon, 
  Inbox as InboxIcon,
  StarBorder, 
  ExpandLess, 
  ExpandMore
} from '@mui/icons-material';

function DemoAPage() {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Container style={{width: 1400, height: "100vh"}}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              WebSocket Demo
            </Typography>
            {/* <Button color="inherit">Login</Button> */}
          </Toolbar>
        </AppBar>

        {/* 左邊群組列表 */}
        <List
          sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
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
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary="Global" />
          </ListItemButton>

{/* Group */}
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Group" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="社群訊息" />
              </ListItemButton>
            </List>
          </Collapse>

{/* Private */}
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Private" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="個人訊息" />
              </ListItemButton>
            </List>
          </Collapse>

        </List>
      </Box>
    </Container>
  )
}

export default DemoAPage

// import { LoginContext } from "../context/Login";
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
// import MenuIcon from '@mui/icons-material/Menu';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { PagesContext } from "../context/Pages";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export function TopBar() {
  const pagesContext = React.useContext(PagesContext);

  const handleAddFriends = () => {
    pagesContext.setPageName('addFriends');
  }

  const handleBackHome = () => {
    pagesContext.setPageName('home');
  }

  const handleBackFriends = () => {
    pagesContext.setPageName('friends');
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed">
        <Toolbar>
          {/* <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton> */}
          {pagesContext.pageName == 'friends' ? <IconButton color="inherit"
            aria-label="back"
            onClick={handleBackHome}
            data-testid="back-button">
            <ArrowBackIcon />
          </IconButton> : null}

          {pagesContext.pageName == 'addFriends' ? <IconButton color="inherit"
            aria-label="back"
            onClick={handleBackFriends}
            data-testid="back-button">
            <ArrowBackIcon />
          </IconButton> : null}

          {pagesContext.pageName == 'home' ? <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Posts
          </Typography> : null}

          {pagesContext.pageName == 'friends' ? <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Friends
          </Typography> : null}

          {pagesContext.pageName == 'addFriends' ? <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Add New Friends
          </Typography> : null}

          {/* <Button color="inherit">Login</Button> */}
          {pagesContext.pageName == 'friends' ? 
            <IconButton onClick={handleAddFriends} data-testid="AddFriends">
              <PersonAddIcon />
            </IconButton> 
            : null }
        </Toolbar>
      </AppBar>
    </Box>
  )
}
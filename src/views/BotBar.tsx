import * as React from 'react';
// import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
// import RestoreIcon from '@mui/icons-material/Restore';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
import LogoutIcon from '@mui/icons-material/Logout';
import Paper from '@mui/material/Paper';
import { LoginContext } from '../context/Login'
import HomeIcon from '@mui/icons-material/Home';
import { PagesContext } from '../context/Pages';
import PeopleIcon from '@mui/icons-material/People';



export function BotBar () {
  const loginContext = React.useContext(LoginContext)
  const pagesContext = React.useContext(PagesContext)
  const logout = () => {
    localStorage.removeItem('user');
    loginContext.setAccessToken('');
    pagesContext.setPageName('');
    // navigate('/login');
  };

  const handleHome = () => {
    pagesContext.setPageName('home');
    // console.log(pagesContext.pageName);
  }

  const handleFriends = () => {
    // console.log('hello');
    pagesContext.setPageName('friends');
    // console.log(pagesContext.pageName);
  }

  return (
    <Paper sx={{position: 'fixed', bottom: 0, left: 0, right: 0}} elevation={3}>
      <BottomNavigation
        showLabels
        //   value={value}
        // onChange={(event, newValue) => {
        //   setValue(newValue);
        // }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<HomeIcon />}
          disabled={pagesContext.pageName == 'home'}
          onClick={handleHome}
          data-testid="Home-Button"
          sx={{
            '&.Mui-disabled': {
              color: 'grey',
            },
          }}
        />
        <BottomNavigationAction
          label="Friends"
          icon={<PeopleIcon />}
          disabled={pagesContext.pageName == 'friends'}
          onClick={handleFriends}
          data-testid="Friends-Button"
          sx={{
            '&.Mui-disabled': {
              color: 'grey',
            },
          }}
        />
        <BottomNavigationAction
          label="Logout"
          aria-label='Logout-Button'
          data-testid="Logout-Button"
          icon={<LogoutIcon />}
          onClick={logout}
        />
      </BottomNavigation>
    </Paper>
  )
}
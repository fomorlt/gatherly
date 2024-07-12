// Code largely based off of my assignment 8

import { LoginContext } from '../context/Login';
import { PagesContext } from '../context/Pages';
import { PostRefreshContext } from '../context/PostRefresh';

// components from MUI, list with avatars
// https://mui.com/material-ui/react-list/
import * as React from 'react';
import {useEffect} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
// import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

// Multi icon right side from MUI
// https://mui.com/material-ui/api/list-item-secondary-action/
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';



// icon button from MUI button
// https://mui.com/material-ui/react-button/


import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HowToRegIcon from '@mui/icons-material/HowToReg';

import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { FriendContext } from '../context/Friends';


export function FriendList() {
  const loginContext = React.useContext(LoginContext);
  const pagesContext = React.useContext(PagesContext);
  const friendContext = React.useContext(FriendContext);
  const refreshContext = React.useContext(PostRefreshContext);
  // adding an interface to useState from here:
  //   https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
  //   const [friends, setFriends] = useState<Member[]>([]);
  //   const [inbound, setInbound] = useState<Member[]>([]);
  //   const [outbound, setOutbound] = useState<Member[]>([]);

  // interface Member {
  //   id: string;
  //   name: string;
  // }

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  //   useEffect(() => {
  //     fetchRequests();
  //     console.log('repeating fetchrequest');
  //   }, [friendContext.outbound]);

  //   useEffect(() => {
  //     fetchFriends();
  //     console.log('repeating fetchfriends');
  //   }, [friendContext.friends]);

  const removeFriend = async (friendId: string) => {
    // try {
    const mutation = {query: `mutation removeFriend { removeFriend(input: {memberId: "${friendId}"}) { id, name } }`}
    await fetch(`/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginContext.accessToken}`,
      },
      body: JSON.stringify(mutation)
    })
      .then((res) => {
        return res.json();
      })
      .then(() => {
        const newFriends = friendContext.friends.filter((friend) => friend.id !== friendId);
        friendContext.setFriends(newFriends);
        const newInbound = friendContext.inbound.filter(friend => friend.id !== friendId);
        friendContext.setInbound(newInbound);
        const newOutbound = friendContext.outbound.filter(friend => friend.id !== friendId);
        friendContext.setOutbound(newOutbound);

        // remove member returned from friends list using setFriends
        // i assume construct a copy of friends, then remove the returned member from the list
        // then setFriends with the new list
      })
  
    // } catch (error) {
    //   console.error('Failed to fetch friends:', error);
    // }
  }

  const fetchFriends = async () => {
    // try {
    const query = {query: `query friend { friend { id, name } }`}
    await fetch(`/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginContext.accessToken}`,
      },
      body: JSON.stringify(query)
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        friendContext.setFriends(json.data.friend);
      })

    // } catch (error) {
    //   console.error('Failed to fetch friends:', error);
    // }
  };

  const acceptFriend = async (friendId: string) => {
    // try {
    const mutation = {query: `mutation acceptRequest { acceptRequest (input: {memberId: "${friendId}"}) { id, name } }`}
    await fetch(`/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginContext.accessToken}`,
      },
      body: JSON.stringify(mutation)
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        // append data to friends somehow here then setFriends it
        const newInbound = friendContext.inbound.filter(friend => friend.id !== friendId);
        friendContext.setInbound(newInbound);
        friendContext.setFriends([...friendContext.friends, json.data.acceptRequest]);
        // let newBool
        // if (refreshContext.refreshBool == true) {
        //     newBool = false;
        // } else {
        //     newBool = true;
        // }
        refreshContext.setRefresh(!refreshContext.refreshBool);
      })

    // } catch (error) {
    //   console.error('Failed to fetch friends:', error);
    // }
  };

  const fetchRequests = async () => {
    // try {
    const query = {query: `query request { request {inbound {id, name}, outbound {id, name}} }`}
    await fetch(`/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginContext.accessToken}`,
      },
      body: JSON.stringify(query)
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        friendContext.setOutbound(json.data.request.outbound);
        friendContext.setInbound(json.data.request.inbound);
      })

    // } catch (error) {
    //   console.error('Failed to fetch requests:', error);
    // }
  };



  //   render post list
  //   image render code from stack overflow
  // https://stackoverflow.com/questions/61263669/does-material-ui-have-an-image-component
  if (pagesContext.pageName == 'friends') {
    return (
      <Box
        sx={{
          maxHeight: 'calc(100vh - 145px)',
        // overflowY: 'auto',
        }}
      >

        <List data-testid='friendlist-testid' sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
          <Toolbar/>
          {/* current friends */}
          {friendContext.friends.map((friend) => (
            <React.Fragment key={friend.id}>
              <ListItem alignItems="flex-start" secondaryAction={<IconButton data-testid="deletefriend-button" onClick={() => removeFriend(friend.id)}>
                <PersonRemoveIcon />
              </IconButton>}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={friend.name}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
          {/* outbound requests */}
          {friendContext.outbound.map((request) => (
            <React.Fragment key={request.id}>
              <ListItem alignItems="flex-start" >
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={request.name}
                />
                <ListItemSecondaryAction>
                  <HowToRegIcon/> 
                  <IconButton onClick={() => removeFriend(request.id)}>
                    <PersonRemoveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              {/* indicator that you are waiting */}


              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
          {/* inbound requests */}
          {friendContext.inbound.map((request) => (
            <React.Fragment key={request.id}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={request.name}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => acceptFriend(request.id)} data-testid="acceptfriend-button">
                    <CheckCircleOutlineIcon />
                  </IconButton>
                  <IconButton onClick={() => removeFriend(request.id)}>
                    <PersonRemoveIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>

              <Divider variant="inset" component="li" />
            </React.Fragment>
          ))}
        </List>
        <Toolbar/>
      </Box>
    )
    
  } else {
    return null;
  }

}
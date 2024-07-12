// Code largely based off of my assignment 8

import { LoginContext } from '../context/Login';
import { PagesContext } from '../context/Pages';

// components from MUI, list with avatars
// https://mui.com/material-ui/react-list/
import * as React from 'react';
import {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Avatar from '@mui/material/Avatar';
// import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { FriendContext } from '../context/Friends';


// icon button from MUI button
// https://mui.com/material-ui/react-button/





export function AddFriendList() {
  const loginContext = React.useContext(LoginContext);
  const pagesContext = React.useContext(PagesContext);
  const friendContext = React.useContext(FriendContext)
  // adding an interface to useState from here:
  //   https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
  const [members, setMembers] = useState<Member[]>([]);
  // const [friends, setFriends] = useState<Member[]>([]);
  // const [outbound, setOutbound] = useState<Member[]>([]);
  // const [inbound, setInbound] = useState<Member[]>([]);

  interface Member {
    id: string;
    name: string;
  }

  useEffect(() => {
    fetchMembers();
  }, [friendContext.friends, friendContext.inbound, friendContext.outbound]);

  // const fetchFriends = async () => {
  //   try {
  //     await fetch(`/api/graphql`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${loginContext.accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         query: `{ friend { id, name } }`
  //       })
  //     })
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((json) => {
  //         friendContext.setFriends(json.data.friend);
  //       })

  //   } catch (error) {
  //     console.error('Failed to fetch friends:', error);
  //   }
  // };

  const fetchMembers = async () => {
    // try {
    // console.log('fetches members');
    const query = {query: `query member { member { id, name } }`}
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
        // for loop for each member in friends and requests - only want members that are not friends and not requested already/have sent a request
        const excludeIds = [...friendContext.friends.map((friend) => friend.id), ...friendContext.inbound.map((inbound) => inbound.id), ...friendContext.outbound.map((outbound) => outbound.id)];
        // console.log(excludeIds);
        const filteredMembers = json.data.member.filter((member: Member) => !excludeIds.includes(member.id) )
        setMembers(filteredMembers);
      })

    // } catch (error) {
    //   console.error('Failed to fetch members:', error);
    // }
  };

  const sendFriendRequest = async (friendId: string) => {
    const mutation = {query: `mutation makeRequest { makeRequest(input: {memberId: "${friendId}"}) { id, name } }`}
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
        friendContext.setOutbound([...friendContext.outbound, json.data.makeRequest]);
        // filter member list based on current friends / outbound
        const newMembers = members.filter((member) => member.id !== friendId);
        setMembers(newMembers);
      })
  };

  // const fetchRequests = async () => {
  //   try {
  //     await fetch(`/api/graphql`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${loginContext.accessToken}`,
  //       },
  //       body: JSON.stringify({
  //         query: `{request {inbound {id, name}, outbound {id, name}}}`
  //       })
  //     })
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((json) => {
  //         setInbound(json.data.request.inbound);
  //         setOutbound(json.data.request.outbound);
  //       })

  //   } catch (error) {
  //     console.error('Failed to fetch requests:', error);
  //   }
  // };



  //   render post list
  //   image render code from stack overflow
  // https://stackoverflow.com/questions/61263669/does-material-ui-have-an-image-component
  if (pagesContext.pageName == 'addFriends') {
    return (
      <Box
        sx={{
          maxHeight: 'calc(100vh - 145px)',
        // overflowY: 'auto',
        }}
      >

        <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
          <Toolbar/>
          {/* members who are not friends */}
          {members.map((member) => (
            <React.Fragment key={member.id}>
              <ListItem alignItems="flex-start" secondaryAction={<IconButton onClick={() => sendFriendRequest(member.id)}>
                <PersonAddIcon />
              </IconButton>}>
                <ListItemAvatar>
                  <Avatar />
                </ListItemAvatar>
                <ListItemText
                  primary={member.name}
                />
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
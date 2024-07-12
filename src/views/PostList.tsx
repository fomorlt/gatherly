// Code largely based off of my assignment 8

import { LoginContext } from '../context/Login';
import { PagesContext } from '../context/Pages';
import { PostRefreshContext } from '../context/PostRefresh';

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
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';


export function PostList() {
  const loginContext = React.useContext(LoginContext);
  const pagesContext = React.useContext(PagesContext);
  const refreshContext = React.useContext(PostRefreshContext);
  // adding an interface to useState from here:
  //   https://stackoverflow.com/questions/53650468/set-types-on-usestate-react-hook-with-typescript
  const [posts, setPosts] = useState<Post[]>([]);

  interface Post {
    id: string;
    content: string;
    name: string;
    posted: string;
    image?: string;
  }

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    // console.log('refresh!');
    // console.log(refreshContext.refreshBool);
    fetchPosts();
  }, [refreshContext.refreshBool, pagesContext.pageName]);

  const fetchPosts = async () => {
    // console.log('runs this!');
    // try {
    const query = {query: `query post { post(page: 1, size: 50) { id, content, name, posted, image } }`}
    await fetch(`/api/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${loginContext.accessToken}`,
      },
      body: JSON.stringify(query)
    })
      .then((res) => {
        // console.log('gets here!')
        return res.json();
      })
      .then((json) => {
        // console.log(json.data.post);
        setPosts(json.data.post);
      })

    // } catch (error) {
    //   console.error('Failed to fetch posts:', error);
    // }
  };



  //   render post list
  //   image render code from stack overflow
  // https://stackoverflow.com/questions/61263669/does-material-ui-have-an-image-component
  if (pagesContext.pageName == 'home') {
    return (
      <Box
        sx={{
          maxHeight: 'calc(100vh - 145px)',
          overflowY: 'auto',
        }}
      >

        <List sx={{ width: '100%', maxWidth: '100%', bgcolor: 'background.paper' }}>
          <Toolbar data-testid="toolbarplease"/>
          {posts.map((post) => (
            <React.Fragment key={post.id}>
              <ListItem alignItems="flex-start"
                sx={{ flexDirection: 'column', alignItems: 'start' }}>
                <ListItemAvatar>
                  <Avatar alt={post.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={post.content}
                  secondary={
                    <React.Fragment>
                      {post.image && post.image.length > 1 ? <Box component="img"
                        sx={{
                          height: 350,
                          width: 350,
                          maxHeight: { xs: 350, md: 250 },
                          maxWidth: { xs: 350, md: 250 },
                        }} src={post.image} alt="Post image" /> : null}
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {post.name}
                      </Typography>
                      {` - ${new Date(post.posted).toLocaleString()}`}
                    </React.Fragment>
                  }
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
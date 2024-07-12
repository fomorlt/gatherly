//Code ported from asgn8 mini project CSE 186
// Testfield, button, box from Material UI
// send icon also from material UI
// Specifically, textfield from Fullwidth component
// button from send button example from MUI
// https://mui.com/material-ui/react-text-field/
// https://mui.com/material-ui/react-button/
//
// box used for compartmentalization
// https://mui.com/material-ui/react-box/
import {TextField, Box} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';

import { LoginContext } from '../context/Login';
import { PostRefreshContext } from '../context/PostRefresh';
import { PagesContext } from '../context/Pages';


// import {useEffect, useState, useContext, useCallback, Fragment} from 'react';

// interface Post {
//     content: string,
//     image: string,
// }

import {useState, useContext} from 'react';
// import {WorkspaceContext} from './Home';

/**
 * Returns a list of Mmessages
 * @return {object} JSX
 */
export function PostSend() {
  const [message, setMessage] = useState('');
  const loginContext = useContext(LoginContext);
  const refreshContext = useContext(PostRefreshContext);
  const pageContext = useContext(PagesContext);

  const sendPost = async (post: string) => {
    try {
      //take message, do pre-processing
      //use URL regex to take any URL sent in the message, 
      // ^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$
      // remove the url and construct a post that 

      // regex from asgn2
      //   console.log('sending post!');
      const urlRegex = /(https?:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?/i;
      const url = post.match(urlRegex);
      const content = post.replace(urlRegex, '').trim(); //do we need to trim?
      const imageURL = url ? url[0] : null; // Use the first URL if available
      let queryURL;
      if (imageURL) {
        // console.log('image detected');
        queryURL = `mutation {  makePost (input: {
                content: "${content}",
                image: "${imageURL}",
              }) {content, id, name, posted, image}}`
      } else {
        // console.log('no image!');
        queryURL = `mutation {  makePost (input: {
                content: "${content}",
              }) {content, id, name, posted, image}}`
      }

      await fetch(`/api/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginContext.accessToken}`,
        },
        body: JSON.stringify({
          query: queryURL,
        })
      });
      // console.log(refreshContext.refreshBool);
      // let newBool
      // if (refreshContext.refreshBool == true) {
      //     console.log('detected true, switching to false');
      //     newBool = false;
      // } else {
      //     console.log('detected false, switching to true');
      //     newBool = true;
      // }
      refreshContext.setRefresh(!refreshContext.refreshBool);
      //   console.log(refreshContext.refreshBool);

    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  // from my login code which in turn is from authenticated book example
  // event type for typescript from stack overflow
  // https://stackoverflow.com/questions/40676343/typescript-input-onchange-event-target-value
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  //   handlesubmit also from ABE
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendPost(message);
    setMessage('');
  };


  // https://stackoverflow.com/questions/69766400/using-form-with-mui-onsubmit-method-not-working
  // Box 'form' so that we can press enter
  if (pageContext.pageName == 'home') {
    return (
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'fixed',
          // bottom: 0,
          bottom: {xs: 60, sm: 60},
          left: 0,
          right: 0,
          padding: '8px',
          borderTop: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
        }}
        autoComplete='off'
      >
        <TextField
          fullWidth
          label="Create a post..."
          name="input-box"
          value={message}
          onChange={handleChange}
          inputProps={{'data-testid': 'post-field '}}
          sx={{mr: 1}}
    
        >
        </TextField>
        <IconButton
          type="submit"
          name='send-post'
          sx={{p: '10px'}}
          aria-label="send"
          data-testid='send-message-button'>
          <SendIcon />
        </IconButton>
    
      </Box>
    );
  } else {
    return null;
  }
  
}
export default PostSend;
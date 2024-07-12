// Login code based off of login code from book example
// UI from MUI, based off of asgn 8 code CSE 186
import React from 'react';

// Button from MUI
// https://mui.com/material-ui/react-button/
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { LoginContext } from '../context/Login'
import { PagesContext } from '../context/Pages';

export function Login() {
  const loginContext = React.useContext(LoginContext);
  const pagesContext = React.useContext(PagesContext);
  const [user, setUser] = React.useState({email: '', password: ''});

  const handleInputChange = (event: any) => {
    const {value, name} = event.target;
    const u = user;
    if (name == 'email') {
      u.email = value;
    } else {
      u.password = value;
    }
    setUser(u);
  };

  const onSubmit = (event: any) => {
    event.preventDefault();
    const query = {query: `query login{login(email: "${user.email}" password: "${user.password}") { name, accessToken }}`}
    fetch('/api/graphql', {
      method: 'POST',
      body: JSON.stringify(query),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.errors) {
          alert(`${json.errors[0].message}`)
        } else {
          loginContext.setAccessToken(json.data.login.accessToken)
          loginContext.setUserName(json.data.login.name)
          // store jwt and login info into local storage
          localStorage.setItem('user', JSON.stringify(json.data.login));
          pagesContext.setPageName('home');
        }
      })
      .catch((e) => {
        alert(e)
      });
  };

  if (loginContext.accessToken.length < 1) {
    return (
      <form onSubmit={onSubmit}>
        <Container maxWidth='sm'>
          <Box display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh">
            <div>
              <Typography variant="h4"
                gutterBottom>
          Sign in to Asgn3
              </Typography>
              <TextField
                required
                id="email"
                aria-label="email-input" // check for naming convention
                label="email"
                name="email"
                margin="normal"
                fullWidth
                // data-testid='email-field'
                inputProps={{'data-testid': 'email-field '}}
                // value={email}
                onChange={handleInputChange}
              // defaultValue="Hello World"
              />
              <TextField
                aria-label="password"
                id="password"
                label="password-input"
                type="password"
                autoComplete="current-password"
                margin="normal"
                name="password"
                inputProps={{'data-testid': 'password-field'}}
                required
                fullWidth
                onChange={handleInputChange}

              />
              <Button
                variant="contained"
                aria-label='submit-Button'
                fullWidth
                type="submit"
                role="button"
              >
            Submit
              </Button>
            </div>
          </Box>
        </Container>
      </form>
    )
  }
  else {
    return null
  }
}

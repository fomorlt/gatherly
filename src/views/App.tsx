/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

/*
 * Feel free to change this as much as you like, but don't add a default export
 */

import { Fragment } from 'react';
// import { Typography } from '@mui/material';
import { LoginProvider } from '../context/Login';
import {PagesProvider} from '../context/Pages';
import { Login } from '../views/Login'
import {Home} from '../views/Home'

export function App() {
  return (
    <Fragment>
      <LoginProvider>
        <PagesProvider>
          <Login/>
          {/* <Typography component="h1" variant="h5">
        CSE187 Assignment 3
        </Typography> */}
          <Home/>
        </PagesProvider>
      </LoginProvider>
    </Fragment>
  );
}
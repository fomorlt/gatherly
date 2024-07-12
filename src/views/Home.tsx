import * as React from 'react';
import { LoginContext } from '../context/Login'
import { TopBar } from './TopBar';
import { BotBar } from './BotBar';
import {PostList} from './PostList'
import { FriendList } from './FriendList';
import { PostSend } from './PostSend';
// import { PagesContext } from '../context/Pages';
import { AddFriendList } from './AddFriendList';
import { FriendProvider } from '../context/Friends';
import { PostRefreshProvider } from '../context/PostRefresh';

export function Home () {

  const loginContext = React.useContext(LoginContext);
  // const pagesContext = React.useContext(PagesContext);
  // Swap out div, maybe use box for overall, put bot bar in a separate thing?
  if (loginContext.accessToken.length >= 1) {
    return (
      <div>
        <TopBar/>
        {/* if pagesContext.pageName = 'home', then render post list */}
        <PostRefreshProvider>
          <PostList/>
          <FriendProvider>
            <FriendList/>
            <AddFriendList/>
          </FriendProvider>
          <PostSend/>
        </PostRefreshProvider>
        <BotBar/>
      </div>
    )
  } else {
    return null;
  }
}

// Login context code from book example

import { PropsWithChildren, useState, createContext } from "react";
 

// parameters to pass into context
export const PostRefreshContext = createContext({
  refreshBool: false,
  setRefresh: (refresh: boolean) => {},
});

export const PostRefreshProvider = ({ children }: PropsWithChildren<{}>) => {
  const [refreshBool, setRefresh] = useState(false);
  //   const [accessToken, setAccessToken] = useState('');
  return (
    <PostRefreshContext.Provider value={{ refreshBool, setRefresh }}>
      {children}
    </PostRefreshContext.Provider>
  );
};
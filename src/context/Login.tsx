// Login context code from book example

import { PropsWithChildren, useState, createContext } from "react";
 

// parameters to pass into context
export const LoginContext = createContext({
  userName: '',
  setUserName: (userName: string) => {},
  accessToken: '',
  setAccessToken: (accessToken: string) => {},
});

export const LoginProvider = ({ children }: PropsWithChildren<{}>) => {
  const [userName, setUserName] = useState('');
  const [accessToken, setAccessToken] = useState('');
  return (
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken}}>
      {children}
    </LoginContext.Provider>
  );
};
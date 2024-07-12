// Login context code from book example

import { PropsWithChildren, useState, createContext } from "react";
 

// parameters to pass into context
export const PagesContext = createContext({
  pageName: '',
  setPageName: (pageName: string) => {},
});

export const PagesProvider = ({ children }: PropsWithChildren<{}>) => {
  const [pageName, setPageName] = useState('home');
  //   const [accessToken, setAccessToken] = useState('');
  return (
    <PagesContext.Provider value={{ pageName, setPageName}}>
      {children}
    </PagesContext.Provider>
  );
};
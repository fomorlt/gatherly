// Login context code from book example

import { PropsWithChildren, useState, createContext } from "react";
 
interface Member {
    id: string;
    name: string;
  }

// code for friend context interface studied from chatgpt
//   https://chat.openai.com/share/4bad2e9b-4d3d-44be-b71c-d06bf7fb39df


// parameters to pass into context
interface FriendContextType {
    friends: Member[];
    inbound: Member[];
    outbound: Member[];
    setFriends: (friends: Member[]) => void;
    setInbound: (inbound: Member[]) => void;
    setOutbound: (outbound: Member[]) => void;
}


const defaultFriendContextValue: FriendContextType = {
  friends: [],
  inbound: [],
  outbound: [],
  setFriends: () => {},
  setInbound: () => {},
  setOutbound: () => {},
};

export const FriendContext = createContext<FriendContextType>(defaultFriendContextValue);

export const FriendProvider = ({ children }: PropsWithChildren<{}>) => {
  const [friends, setFriends] = useState<Member[]>([]);
  const [inbound, setInbound] = useState<Member[]>([]);
  const [outbound, setOutbound] = useState<Member[]>([]);

  return (
    <FriendContext.Provider value={{
      friends,
      inbound,
      outbound,
      setFriends,
      setInbound,
      setOutbound,}}>
      {children}
    </FriendContext.Provider>
  );
};
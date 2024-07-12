import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { LoginContext } from '../../src/context/Login'
import { PagesContext } from '../../src/context/Pages'
import { PostRefreshContext } from '../../src/context/PostRefresh';
import { FriendList } from '../../src/views/FriendList';
import { FriendContext } from '../../src/context/Friends';

const handlers = [
    graphql.query('friend', ({ query }) => {
      console.log(query);
        return HttpResponse.json({
          data: {
            friend: [{
              "id": '739e0af4-e499-4142-a6f8-0c3f9a7a8c24',
              "name": 'Sally Salesman',
            }
          ]}
        })
      }),
      graphql.mutation('removeFriend', ({ query }) => {
        console.log(query);
        return HttpResponse.json({
          data: {
            removeFriend: {
              "id": '739e0af4-e499-4142-a6f8-0c3f9a7a8c24',
              "name": 'Sally Salesman',
            }
          }
        })
      }),
      graphql.mutation('acceptRequest', ({ query, variables }) => {
        return HttpResponse.json({
          data: {
            acceptRequest: {
              "id": 'dfb60737-ca69-4b93-8dea-0ff4ea33d26f',
              "name": 'Barbie Buyer',
            }
          },
        })
      }),
      graphql.query('request', () => {
        return HttpResponse.json({
          data: {
            request: {
              inbound: [{
                "id": '44604202-0288-4b80-b742-5c350a0f5559',
                "name": 'Barbie Buyer',
              }],
              outbound: [{
                "id": 'dfb60737-ca69-4b93-8dea-0ff4ea33d26f',
                "name": 'Konan Le',
              }],
            }
          },
        })
      }),

    
]

const friendResponse = {
  data: {
    friend: [
      {
        id: '739e0af4-e499-4142-a6f8-0c3f9a7a8c24',
        name: 'Sally Salesman',
      },
    ],
  },
};

const requestResponse = {
  data: {
    request: {
      inbound: [
        {
          id: '44604202-0288-4b80-b742-5c350a0f5559',
          name: 'Barbie Buyer',
        },
      ],
      outbound: [
        {
          id: 'dfb60737-ca69-4b93-8dea-0ff4ea33d26f',
          name: 'Konan Le',
        },
      ],
    },
  },
};

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

interface Member {
    id: string;
    name: string;
  }

  it('Doesnt render if not friends page', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'home';
    const setPageName = () => {};

    // Post Refresh Context
    const refreshBool = false;
    const setRefresh = () => {};

    // Friends Context
    const friends: Member[] = [];
    const inbound: Member[] = [];
    const outbound: Member[] = [];
    const setFriends = () => {};
    const setInbound = () => {};
    const setOutbound = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
          <PostRefreshContext.Provider value = {{refreshBool, setRefresh}}>
            <FriendContext.Provider value = {{friends, inbound, outbound, setFriends, setInbound, setOutbound}}>
                <FriendList />
            </FriendContext.Provider>
          </PostRefreshContext.Provider>
        </PagesContext.Provider>
    </LoginContext.Provider>
)
expect(screen.queryAllByText('Sally Salesman').length).toBe(0)
});

it('Renders Friend List', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'friends';
    const setPageName = () => {};

    // Post Refresh Context
    const refreshBool = false;
    const setRefresh = () => {};

    // Friends Context
    // const friends: Member[] = [];
    // const inbound: Member[] = [];
    // const outbound: Member[] = [];
    // const setFriends = () => {};
    // const setInbound = () => {};
    // const setOutbound = () => {};
    const friends: Member[] = friendResponse.data.friend;
    const inbound: Member[] = requestResponse.data.request.inbound;
    const outbound: Member[] = requestResponse.data.request.outbound;
    const setFriends = () => {};
    const setInbound = () => {};
    const setOutbound = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
          <PostRefreshContext.Provider value = {{refreshBool, setRefresh}}>
            <FriendContext.Provider value = {{friends, inbound, outbound, setFriends, setInbound, setOutbound}}>
                <FriendList />
            </FriendContext.Provider>
          </PostRefreshContext.Provider>
        </PagesContext.Provider>
    </LoginContext.Provider>
)
  // await screen.findByText('Sally Salesman');
  await screen.findByTestId('friendlist-testid');
  fireEvent.click(screen.getByTestId('acceptfriend-button'));
  fireEvent.click(screen.getByTestId('deletefriend-button'));
  
});

it('Specifically targets delete button', async () => {

  // Login context mocking
  const accessToken = 'some old token'
  const setAccessToken = () => {};
  const userName = '';
  const setUserName= () => {};

  // Page context mocking
  const pageName = 'friends';
  const setPageName = () => {};

  // Post Refresh Context
  const refreshBool = false;
  const setRefresh = () => {};

  // Friends Context
  // const friends: Member[] = [];
  // const inbound: Member[] = [];
  // const outbound: Member[] = [];
  // const setFriends = () => {};
  // const setInbound = () => {};
  // const setOutbound = () => {};
  const friends: Member[] = friendResponse.data.friend;
  const inbound: Member[] = requestResponse.data.request.inbound;
  const outbound: Member[] = requestResponse.data.request.outbound;
  const setFriends = () => {};
  const setInbound = () => {};
  const setOutbound = () => {};

render(
  <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
      <PagesContext.Provider value = {{ pageName, setPageName }}>
        <PostRefreshContext.Provider value = {{refreshBool, setRefresh}}>
          <FriendContext.Provider value = {{friends, inbound, outbound, setFriends, setInbound, setOutbound}}>
              <FriendList />
          </FriendContext.Provider>
        </PostRefreshContext.Provider>
      </PagesContext.Provider>
  </LoginContext.Provider>
)
// await screen.findByText('Sally Salesman');
fireEvent.click(screen.getByTestId('deletefriend-button'));

});
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { LoginContext } from '../../src/context/Login'
import { PagesContext } from '../../src/context/Pages'
import {TopBar} from '../../src/views/TopBar';

const handlers = [
  graphql.query('login', ({ query, variables }) => {
    console.log(query)
    if (query.includes('anna@books.com')) {
      return HttpResponse.json({
        errors: [ {
            "message": "Some Error",
          },
        ]},
      )
    }
    return HttpResponse.json({
      data: {
        login: {
          "name": "Some Name",
          "accessToken": "Some JWT"
        },
      },
    })
  }),
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('Renders TopBar Posts', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'home';
    const setPageName = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
            <TopBar />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
await screen.findByText('Posts');
});

it('Renders TopBar Friends', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'friends';
    const setPageName = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
            <TopBar />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
await screen.findByText('Friends');
});

it('Renders TopBar Add New Friends', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'addFriends';
    const setPageName = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
            <TopBar />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
await screen.findByText('Add New Friends');
});

it('Click add new friends', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'friends';
    const setPageName = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
            <TopBar />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
fireEvent.click(screen.getByTestId('AddFriends'));
});

it('Click back from friends', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'friends';
    const setPageName = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
            <TopBar />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
fireEvent.click(screen.getByTestId('back-button'));
});

it('Click back from add new friends', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'addFriends';
    const setPageName = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
            <TopBar />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
fireEvent.click(screen.getByTestId('back-button'));
});
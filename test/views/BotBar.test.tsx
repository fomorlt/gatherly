import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { LoginContext } from '../../src/context/Login'
import { PagesContext } from '../../src/context/Pages'
import {BotBar} from '../../src/views/BotBar';

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

it('Renders BotBar, clicks friends and logout', async () => {

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
            <BotBar />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
fireEvent.click(screen.getByTestId('Friends-Button'));
fireEvent.click(screen.getByTestId('Logout-Button'));
});

it('Renders BotBar', async () => {

    // Login context mocking
    const accessToken = 'some old token'
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'friend';
    const setPageName = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
            <BotBar />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
fireEvent.click(screen.getByTestId('Home-Button'));
});
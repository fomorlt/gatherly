/*
Login tests based off of next typegraphql auth book example
*/

import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { LoginContext } from '../../src/context/Login'
import { Login } from '../../src/views/Login';

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

it('Signs Molly In', async () => {
  render(<Login />)
  const emailField = screen.getByTestId('email-field');
  await userEvent.type(emailField, 'molly@books.com')

  const passField = screen.getByTestId('password-field');
  await userEvent.type(passField, 'mollymember')
  fireEvent.click(screen.getByText('Submit'));
});

it('Rejects Bad Credentials', async () => {
  let alerted = false
  window.alert = () => { alerted = true }
  render(<Login />)
  const emailField = screen.getByTestId('email-field');
  await userEvent.type(emailField, 'anna@books.com')

  const passField = screen.getByTestId('password-field');
  await userEvent.type(passField, 'not-anna-pass')
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(alerted).toBeTruthy()
  });
});

it('Does Not Render with accessToken (already logged in)', async () => {
  const accessToken = 'some old token'
  const setAccessToken = () => {}
  const userName = ''
  const setUserName= () => {}
  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
      <Login/>
    </LoginContext.Provider>
  )
  expect(screen.queryAllByText('Submit').length).toBe(0)
});

it('Alerts When No Server', async () => {
  server.close()
  let alerted = false
  window.alert = () => { alerted = true }
  render(<Login />)
  const emailField = screen.getByTestId('email-field');
  await userEvent.type(emailField, 'anna@books.com')

  const passField = screen.getByTestId('password-field');
  await userEvent.type(passField, 'not-anna-pass')
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => {
    expect(alerted).toBeTruthy()
  });
});

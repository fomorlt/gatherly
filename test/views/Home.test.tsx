import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { LoginContext } from '../../src/context/Login'
import { PagesContext } from '../../src/context/Pages'
import { Home } from '../../src/views/Home';

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
  graphql.query('post', ({query, variables}) => {
    // console.log(query);
    // const { page } = variables
    // console.log(page);
    return HttpResponse.json({
        data: {
            post: [
              {
                "id": "b1177ae3-d53c-4fee-b816-e1c412f26599",
                "content": "Molly Post 1",
                "name": "Molly Member",
                "posted": `${new Date().toLocaleString()}`,
                "image": "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/computer-coding.jpg",
            }, 
            {
                "id": "b1177ae3-d53c-4fee-b816-e1c412f26599",
                "name": "Molly Member",
                "content": "Molly Post 2",
                "image": "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2023/07/computer-coding.jpg",
                "posted": `${new Date().toLocaleString()}`,
            }, 
            {
                "id": "b1177ae3-d53c-4fee-b816-e1c412f26599",
                "name": "Molly Member",
                "content": "Molly Post 3",
                "posted": `${new Date().toLocaleString()}`,
            }
          ]
        }
    })
  }
),
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

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

it('Renders Home', async () => {

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
            <Home />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
await screen.findByText('Posts');
});

it('Not logged in, doesnt render', async () => {

    // Login context mocking
    const accessToken = ''
    const setAccessToken = () => {};
    const userName = '';
    const setUserName= () => {};

    // Page context mocking
    const pageName = 'home';
    const setPageName = () => {};

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
            <Home />
        </PagesContext.Provider>
    </LoginContext.Provider>
)
// await screen.findByText('Posts');
});
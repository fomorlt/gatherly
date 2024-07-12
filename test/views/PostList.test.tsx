import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { graphql, HttpResponse } from 'msw'
import { setupServer } from 'msw/node';

import { LoginContext } from '../../src/context/Login'
import { PagesContext } from '../../src/context/Pages'
import { PostRefreshContext } from '../../src/context/PostRefresh';
import { PostList } from '../../src/views/PostList';

const handlers = [
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
)
]

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());


it('Doesnt render Post List if not home page', async () => {

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

render(
  <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
      <PagesContext.Provider value = {{ pageName, setPageName }}>
        <PostRefreshContext.Provider value = {{refreshBool, setRefresh}}>
          <PostList />
        </PostRefreshContext.Provider>
      </PagesContext.Provider>
  </LoginContext.Provider>
)
});


it('Renders Post List', async () => {

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

  render(
    <LoginContext.Provider value={{ userName, setUserName, accessToken, setAccessToken }}>
        <PagesContext.Provider value = {{ pageName, setPageName }}>
          <PostRefreshContext.Provider value = {{refreshBool, setRefresh}}>
            <PostList />
          </PostRefreshContext.Provider>
        </PagesContext.Provider>
    </LoginContext.Provider>
)
  await screen.findByText('Molly Post 1');
});
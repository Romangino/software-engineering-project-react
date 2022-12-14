import {UserList} from "../components/profile/user-list";
import {screen, render} from "@testing-library/react";
import {HashRouter} from "react-router-dom";
import {findAllUsers} from "../services/users-service";

const axios = require('axios')


const MOCKED_USERS = [
  {username: 'ellen_ripley', password: 'lv426', email: 'repley@weyland.com', _id: "123"},
  {username: 'sarah_conor', password: 'illbeback', email: 'sarah@bigjeff.com', _id: "234"},
]

test('user list renders static user array', () => {
  render(
    <HashRouter>
      <UserList users={MOCKED_USERS}/>
    </HashRouter>);
  const linkElement = screen.getByText(/ellen_ripley/i);
  expect(linkElement).toBeInTheDocument();
});

test('user list renders async', async () => {
  const users = await findAllUsers();
  render(
    <HashRouter>
      <UserList users={users}/>
    </HashRouter>);

  const linkElement = screen.getByText(/charlie/i);
  expect(linkElement).toBeInTheDocument();
})

describe('user list renders mocked', () => {
  beforeAll(() => {
    jest.spyOn(axios, 'get').mockImplementation()
  })

  afterAll(() => {
    jest.resetAllMocks()
  })

  test('user list renders mocked', async () => {
    axios.get.mockImplementation(() =>
                                     Promise.resolve({ data: {users: MOCKED_USERS} }));
    const response = await findAllUsers();
    const users = response.users;

    // Render user list
    render(
        <HashRouter>
          <UserList users={users}/>
        </HashRouter>);

    const user = screen.getByText(/ellen_ripley/i);
    expect(user).toBeInTheDocument();
  });
})

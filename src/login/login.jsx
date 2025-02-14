import React from 'react';
import './login.css';

export function Login() {
  const [userName, setUserName] = React.useState('');
  const [password, setPassword] = React.useState('');

  async function loginUser() {
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
  }

  async function createUser() {
    localStorage.setItem('userName', userName);
    props.onLogin(userName);
  }

  return (
    <main>
      <div>
        <h2>Create an Account</h2>
        <p>Note: Will Redirect to 3rd Party API GoOPT for Verification</p>
        <form method="get" action="/vote">
            <ul>
                <label for="NetID">NetID</label>
                <input type="text" onChange={(e) => setUserName(e.target.value)} placeholder="NetID" required />
            </ul>
            <ul>
                <label for="password">Password</label>
                <input type="text" onChange={(e) => setUserName(e.target.value)} placeholder="Password" required />
            </ul>
            <button type="submit">Create</button>
        </form>

        <h2>Login</h2>
        <p>Note: Will Redirect to 3rd Party API GoOPT for Verification</p>
        <form method="get" action="/results">
            <ul>
                <label for="NetID">NetID</label>
                <input type="text" placeholder="NetID" required />
            </ul>
            <ul>
                <label for="password">Password</label>
                <input type="text" placeholder="Password" required />
            </ul>
            <button type="submit">Login</button>
        </form>
      </div>
    </main>
  );
}
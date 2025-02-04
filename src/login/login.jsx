import React from 'react';
import './login.css';

export function Login() {
  return (
    <main>
      <div>
        <h2>Create an Account</h2>
        <p>Note: Will Redirect to 3rd Party API GoOPT for Verification</p>
        <form method="get" action="vote.html">
            <ul>
                <label for="NetID">NetID</label>
                <input type="text" placeholder="NetID" required />
            </ul>
            <ul>
                <label for="password">Password</label>
                <input type="text" placeholder="Password" required />
            </ul>
            <button type="submit">Create</button>
        </form>

        <h2>Login</h2>
        <p>Note: Will Redirect to 3rd Party API GoOPT for Verification</p>
        <form method="get" action="results.html">
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
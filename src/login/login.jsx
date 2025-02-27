import React from 'react';
import './login.css';

export function Login({setUser}) {
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  function loginUser(){
    localStorage.setItem('username', user);
    localStorage.setItem('password', password);
    setUser(user);
  }

  function textChange(e){
    setText(e.target.value);
  }

  return (
    <main>
      <div>
        <h2>Create an Account</h2>
        <p>Note: Will Redirect to 3rd Party API GoOPT for Verification instead of Vote</p>
        <form method="get" action="/vote">
            <ul>
                <label for="Username">Username</label>
                <input type="text" onChange={textChange} placeholder="Username" required />
            </ul>
            <ul>
                <label for="password">Password</label>
                <input type="text" onChange={textChange} placeholder="Password" required />
            </ul>
            <button type="submit" onClick={loginUser}>Create</button>
        </form>

        <h2>Login</h2>
        <form method="get" action="/results">
          
            <button type="submit">Login</button>
        </form>
      </div>
    </main>
  );
}
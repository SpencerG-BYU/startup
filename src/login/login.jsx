import React from 'react';
import {useNavigate} from 'react-router-dom';
import './login.css';

export function Login({setUser}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  
  function handleRegister(){
    createAuth('POST', '/api/auth/create', '/vote');
  }

  function handleLogin(){
    createAuth('PUT', '/api/auth/login', '/results');
  }

  function userChange(e){
    setUsername(e.target.value);
  }

  function passwordChange(e){
    setPassword(e.target.value);
  }

  async function createAuth(method, fetchPath, navigatePath){
    const response = await fetch(fetchPath, {
      method: method,
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password}),
    });
    await response.json();
    if (response.ok) {
      navigate(navigatePath);
    } else {
      alert('Authentication failed');
    }
  }

  return (
    <main>
        <h2>Create an Account</h2>
        <p>Note: Will Eventually Redirect to 3rd Party API for Verification instead of Vote</p>
        <div>
            <ul>
                <label htmlFor="Username">Username</label>
                <input type="text" onChange={userChange} placeholder="Username" />
            </ul>
            <ul>
                <label htmlFor="password">Password</label>
                <input type="text" onChange={passwordChange} placeholder="Password" />
            </ul>
            <button onClick={handleRegister}>Create</button>
            <button onClick={handleLogin}>Login</button>
        </div>        
    </main>
  );
}
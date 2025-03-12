import React from 'react';
import {useNavigate} from 'react-router-dom';
import './login.css';

export function Login({setUser}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = useNavigate();
  
  function handleRegister(){
    if (!username || !password) {
      alert('Username and password required');
      return;
    }
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
      const body = await response.json();
      if (response?.status === 200) {
        setUser(body.username);
        localStorage.setItem('username', body.username);
        navigate(navigatePath);
      } else {  
        alert(body.msg);
      }
  }

  return (
    <main>
        <h2>Create an Account</h2>
        <div>
            <ul>
                <label htmlFor="username">Username</label>
                <input id="username" type="text" onChange={userChange} placeholder="Username" />
            </ul>
            <ul>
                <label htmlFor="password">Password</label>
                <input id="password" type="text" onChange={passwordChange} placeholder="Password" />
            </ul>
            <button onClick={handleRegister}>Create</button>
            <button onClick={handleLogin}>Login</button>
        </div>        
    </main>
  );
}
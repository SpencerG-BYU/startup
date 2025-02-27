import React from 'react';
import './login.css';

export function Login({setUser}) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const navigate = React.useNavigate();
  
  function createUser(){
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    setUser(username);
    navigate('/vote');
  }

  function loginUser(){
    if (localStorage.getItem('username') === user && localStorage.getItem('password') === password){
      setUser(username);
      navigate('/results');
    } else {
      alert('Invalid username or password');
    }
  }

  function userChange(e){
    setUsername(e.target.value);
  }

  function passwordChange(e){
    setPassword(e.target.value);
  }

  return (
    <main>
      <div>
        <h2>Create an Account</h2>
        <p>Note: Will Redirect to 3rd Party API GoOPT for Verification instead of Vote</p>
            <ul>
                <label for="Username">Username</label>
                <input type="text" onChange={userChange} placeholder="Username" required />
            </ul>
            <ul>
                <label for="password">Password</label>
                <input type="text" onChange={passwordChange} placeholder="Password" required />
            </ul>
            <button type="submit" onClick={createUser}>Create</button>

        <h2>Login</h2>
          <ul>
              <label for="Username">Username</label>
              <input type="text" onChange={userChange} placeholder="Username" required />
          </ul>
          <ul>
              <label for="password">Password</label>
              <input type="text" onChange={passwordChange} placeholder="Password" required />
          </ul>
            <button type="submit" onClick={loginUser}>Login</button>        
      </div>
    </main>
  );
}
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Results } from './results/results';
import { Vote } from './vote/vote';

export default function App() {
    const [user, setUser] = React.useState(localStorage.getItem('username') || null);
    
    return (
    <BrowserRouter>
    <div>
        <header>
        <h1>Controversy Solver</h1>
        <nav>
            <ul>
                <li>
                    <NavLink className='nav-link' to=''>Login</NavLink>
                </li>
                <li>
                    <NavLink className='nav-link' to='vote'>Vote</NavLink>
                </li>
                <li>
                    <NavLink className='nav-link' to='results'>Results</NavLink>
                </li>
            </ul>
        </nav>
        <ul>{user}</ul>
        </header>

        <Routes>
            <Route path='/' element={<Login setUser={setUser} />} exact />
            <Route path='/vote' element={<Vote />} />
            <Route path='/results' element={<Results />} />
            <Route path='*' element={<NotFound />} />
        </Routes>

        <footer>
            <p>Spencer Glade</p>
            <a href="https://github.com/SpencerG-BYU/startup">GitHub</a>
        </footer>
    </div>
    </BrowserRouter>
    );
}

function NotFound() {
    return <main>404: Return to sender. Address unknown.</main>;
  }
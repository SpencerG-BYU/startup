import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Results } from './results/results';
import { Vote } from './vote/vote';

export default function App() {
    return (
    <BrowserRouter>
    <div>
        <header>
        <h1>Controversy Solver</h1>
        <nav>
            <ul>
                <NavLink className='nav-link' to=''>Login</NavLink>
                <NavLink className='nav-link' to='vote'>Vote</NavLink>
                <NavLink className='nav-link' to='results'>Results</NavLink>
            </ul>
        </nav>
        </header>

        <footer>
            <p>Spencer Glade</p>
            <a href="https://github.com/SpencerG-BYU/startup">GitHub</a>
        </footer>
    </div>
    </BrowserRouter>
    );
}
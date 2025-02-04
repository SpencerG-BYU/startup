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
                <li><a href="index.html">Login</a></li>
                <li><a href="vote.html">Vote</a></li>
                <li><a href="results.html">Results</a></li>
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
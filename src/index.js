import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Tetris from './containers/Tetris';
import Home from './pages/Home';
import Help from './pages/Help';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={ <Tetris /> } />
      <Route path="/help" element={ <Help /> } />
      <Route path="/leaderboard" element={ <Leaderboard /> } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Help from './pages/Help';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import GameResult from './containers/GameResult';
import './index.css';
import reportWebVitals from './reportWebVitals';
import store from './utils/store';
import { Provider } from 'react-redux'; 
import Tetris from './containers/Tetris';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game" element={ <Tetris /> } />
      <Route path="/game/result" element={<GameResult fromGame={false} />} />
      <Route path="/help" element={ <Help /> } />
      <Route path="/leaderboard" element={ <Leaderboard /> } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
    </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

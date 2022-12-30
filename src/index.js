import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Help from './pages/Help';
import Leaderboard from './pages/Leaderboard';
import NotFound from './pages/NotFound';
import GameResult from './containers/GameResult';
import './index.css';
import './pages/styles/colors.css';
import Controls from './pages/help-panes/Controls';
import Credits from './pages/help-panes/Credits';
import Rules from './pages/help-panes/Rules';
import TechStack from './pages/help-panes/TechStack';
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
      <Route path="/help" element={ <Help /> }>
        <Route path="/help/controls" element={<Controls />} />
        <Route path="/help/rules" element={<Rules />} />
        <Route path="/help/techstack" element={<TechStack />} />
        <Route path="/help/credits" element={<Credits />} />
      </Route>
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

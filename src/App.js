import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import AuthPage from './components/AuthPage.js';
import HomePage from './components/HomePage.js';
import MsgInbox from './components/MsgInbox.js';
import ProfileDetails from './components/profileDetails.js';
import OnlineUsers from './components/onlineUsers.js';
import GameApp from './GameApp.js';

const App = () => {

  return ( 
    <div className="app">

      <BrowserRouter>
      <Routes>
          <Route path="/" element={<AuthPage/>}/>
          <Route path="/homepage" element={<HomePage/>}/>
          <Route path="/inbox" element={<MsgInbox/>}/>
          <Route path="/profile" element={<ProfileDetails/>}/>
          <Route path="/users" element={<OnlineUsers/>}/>
          <Route path="/game" element={<GameApp />}/>
      </Routes>
      </BrowserRouter>

    </div>
  
  );
};

export default App;
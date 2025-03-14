import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import AuthPage from './components/AuthPage.js';
import HomePage from './components/HomePage.js';
import MsgInbox from './components/MsgInbox.js';
import ProfileDetails from './components/profileDetails.js';
import OnlineUsers from './components/onlineUsers.js';
import GameApp from './components/game.js';
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ isAuthenticated }) => {
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const isLoggedIn = () => {

}

const App = () => {

  return ( 
    <div className="app">

      <BrowserRouter>
      <Routes>
          <Route path="/" element={<AuthPage />} />

          <Route path="/homepage" element={<ProtectedRoute  isAuthenticated={isLoggedIn}/>}>
            <Route path="" element={<HomePage />} />
          </Route>
          <Route path="/inbox" element={<ProtectedRoute  isAuthenticated={isLoggedIn}/>}>
            <Route path="" element={<MsgInbox />} />
          </Route>
          <Route path="/profile" element={<ProtectedRoute  isAuthenticated={isLoggedIn}/>}>
            <Route path="" element={<ProfileDetails />} />
          </Route>
          <Route path="/users" element={<ProtectedRoute  isAuthenticated={isLoggedIn}/>}>
            <Route path="" element={<OnlineUsers />} />
          </Route>
          <Route path="/game" element={<ProtectedRoute  isAuthenticated={isLoggedIn} />}>
            <Route path="" element={<GameApp />} />
          </Route>
      </Routes>
      </BrowserRouter>

    </div>
  
  );
};

export default App;
import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthPage from './components/AuthPage.js';
import HomePage from './components/HomePage.js';
import MsgInbox from './components/MsgInbox.js';
import ProfileDetails from './components/profileDetails.js';
import OnlineUsers from './components/onlineUsers.js';
import GameApp from './GameApp.js';

const App = () => {

  const confirmLogout= async()=>{
    var uid = sessionStorage.getItem("uid");
    var url = 'https://chess-play-a5vm.onrender.com/chess-user/user/logout/'+uid;
    const response = await axios.get(url);
    console.log('Logout:',response.data);
  }

  const handleLogout = () => {
  
    // Redirect to login page
    //navigate('/'); // Adjust the path as per your routing
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear user data (e.g., remove tokens or session info)
    confirmLogout();
    localStorage.removeItem('authToken'); // Example: Remove token from localStorage
    sessionStorage.removeItem('userSession'); // Example: Clear session data
    window.location.href='/';
    }
  };

  return (
    <div className="app">
      
      <div style={{ maxWidth: "500px", margin: "20px auto", textAlign: "right" }}>
      <button
              onClick={handleLogout}
              style={{
                padding: "5px 10px",
                backgroundColor: "#FAA011",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
      </div>

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
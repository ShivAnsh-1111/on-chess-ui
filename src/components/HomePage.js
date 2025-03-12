import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {
  const navigate = useNavigate();
  const playChess = () => navigate("/game");
  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const confirmLogout = async () => {
    var uid = sessionStorage.getItem("uid");
    var url = apiUrl + '/chess-user/user/logout/' + uid;
    const response = await axios.get(url);
    console.log('Logout:', response.data);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      confirmLogout();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/';
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>Online Chess</h1>
        <p style={styles.subtitle}>Learn -- Play -- Win -- Repeat</p>
        <div style={styles.ctaWrapper}>
          <button onClick={playChess} style={styles.ctaButton}>New Game</button>
        </div>
      </header>
      
      {/* Logout Button at Top Right */}
      <div style={styles.logoutContainer}>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>
      
      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Features</h2>
        <div style={styles.featuresList}>
          <div style={styles.feature}><a href='/profile'>User Profile</a><p>Check update your profile !!</p></div>
          <div style={styles.feature}><a href='/inbox'>User Inbox</a><p>Connect with friends !!</p></div>
          <div style={styles.feature}><a href='/users'>Online Users</a><p>Invite friends to play !!</p></div>
        </div>
      </section>
      
      {/* About Section */}
      <section style={styles.aboutSection}>
        <h2 style={styles.sectionTitle}>About Us</h2>
        <p>We are dedicated to providing the best service to our customers. Learn more about our story and mission.</p>
      </section>

      {/* Footer Section */}
      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    textAlign: 'center',
    height: '18vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '1vh',
  },
  title: {
    fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
    margin: '0',
  },
  subtitle: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    margin: '0.5vh 0',
  },
  ctaWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  ctaButton: {
    backgroundColor: '#fff',
    color: '#4CAF50',
    border: 'none',
    padding: '8px 16px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '1vh',
  },
  logoutContainer: {
    position: 'absolute',
    top: '10px',
    right: '20px',
  },
  logoutButton: {
    padding: '5px 10px',
    backgroundColor: '#FAA011',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  featuresSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '2vh 5vw',
  },
  featuresList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  feature: {
    padding: '1.5vh',
    border: '1px solid #ddd',
    borderRadius: '1vw',
    backgroundColor: '#fff',
    textAlign: 'left',
    width: '50%',
  },
  aboutSection: {
    textAlign: 'center',
    padding: '20px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '1vh 0',
    height: '7vh',
  },
};

export default HomePage;

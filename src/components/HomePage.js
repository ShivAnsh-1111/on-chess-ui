import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const HomePage = () => {

  const navigate = useNavigate()

  const playChess=()=>{
    navigate("/game");
  }

  const apiUrl = process.env.REACT_APP_BACKEND_URL;

  const confirmLogout= async()=>{
    var uid = sessionStorage.getItem("uid");
    var url = apiUrl + '/chess-user/user/logout/'+uid;
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
    
    <div style={styles.container}>
      
      {/* Header Section */}
      <header style={styles.header}>
        <h1 style={styles.title}>Welcome to Online Chess</h1>
        <p style={styles.subtitle}>Learn -- Play -- Win -- Repeat </p>
        <button onClick={playChess} style={styles.ctaButton}>New Game</button>
      </header>

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

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Features</h2>
        <div style={styles.features}>
          <div style={styles.feature}>
          <a href='/profile'>User Profile</a>
            <p>Check update your profile !!</p>
          </div>
          <div style={styles.feature}>
            <a href='/inbox'>User Inbox</a>
            <p>Connect with friends !!</p>
          </div>
          <div style={styles.feature}>
          <a href='/users'>Online Users</a>
            <p>Invite friends to play !!</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={styles.aboutSection}>
        <h2 style={styles.sectionTitle}>About Us</h2>
        <p>
          We are dedicated to providing the best service to our customers. Learn more about our story and mission.
        </p>
      </section>

      {/* Footer Section */}
      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} My Website. All rights reserved.</p>
      </footer>
    </div>
  );
};


// CSS-in-JS styling
const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    margin: '0',
    padding: '0',
    color: '#333',
    border: 'solid',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '20px 0',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    margin: '0',
  },
  subtitle: {
    fontSize: '1.2rem',
    margin: '10px 0',
  },
  ctaButton: {
    backgroundColor: '#fff',
    color: '#4CAF50',
    border: 'none',
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '10px',
  },
  featuresSection: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: '2rem',
    marginBottom: '10px',
  },
  features: {
    display: 'flex',
    //justifyContent: 'space-around',
    flexWrap: 'wrap',
    flexDirection: 'column',
  },
  feature: {
    flex: '0 0 30%',
    margin: '10px',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    backgroundColor: '#fff',
    textAlign: 'left',
  },
  aboutSection: {
    padding: '20px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'center',
    padding: '10px 0',
  },
};

export default HomePage;

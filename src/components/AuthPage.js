import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In and Sign Up
  const [error, setError] = useState('');

  const loginAct=async()=>{

    const url = isSignUp ? apiUrl+'/chess-user/user/register' : apiUrl+'/chess-user/user/login';

    const payload = {
      username: username,
      email: email,
      password: password,
    }

    try {
        const response = await axios.post(url, payload);

        // Handle success
        if(!isSignUp){
            console.log('Success:', response.data);
            console.log(response.data[2]);
            alert('Success! You are now signed in.');
            sessionStorage.setItem("uid",response.data[2]);
            sessionStorage.setItem("username",username);
            gotToNewPage();

        } else {
            setIsSignUp(false);
            var res = response.data;
            console.log('Success:', res);
            alert('Success! You registered successfully.');
        }
    } catch (error) {
        // Handle error
        console.error('Error:', error.response ? error.response.data : error.message);
        alert(`Error: ${error.response?.data.message || error.message}`);
    }
  };

  
  const navigate = useNavigate()

  const gotToNewPage=()=>{
    navigate("/homepage");
  }
    
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // try {
    //   if (isSignUp) {
    //     await createUserWithEmailAndPassword(auth, email, password);
    //     alert('User created successfully! Please sign in.');
    //     setIsSignUp(false);
    //   } else {
    //     await signInWithEmailAndPassword(auth, email, password);
    //     alert('Signed in successfully!');
    //   }
    // } catch (err) {
    //   setError(err.message);
    // }

    loginAct();
  };

  // Sign in with Google
  const handleGoogleSignIn = async () => {
    // const provider = new GoogleAuthProvider();
    // try {
    //   await signInWithPopup(auth, provider);
    //   alert('Signed in with Google!');
    // } catch (err) {
    //   setError(err.message);
    // }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          />
        </div>
        {isSignUp ?
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', margin: '8px 0', boxSizing: 'border-box' }}
          /> 
        </div> : <div></div>}
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
      <p style={{ textAlign: 'center', margin: '10px 0' }}>or</p>
      <button
        onClick={handleGoogleSignIn}
        style={{ width: '100%', padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Sign in with Google
      </button>
      <p style={{ textAlign: 'center', margin: '10px 0' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  );
};

export default Login;

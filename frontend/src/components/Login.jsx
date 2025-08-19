
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the new CSS file

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Re-using the login logic by calling it directly
    await performLogin(username, password);
  };

  // Extracted login logic to be reusable
  const performLogin = async (user, pass) => {
    try {
      const response = await axios.post('/api/token/', {
        username: user,
        password: pass,
      });
      setToken(response.data.access);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // You might want to add some user-facing error message here
    }
  };
  
  // Handler for the new "Test Credentials" button
  const handleTestClick = async () => {
    const testUser = 'test_cred';
    const testPass = 'test_cred';

    // Set the state to fill the input fields visually
    setUsername(testUser);
    setPassword(testPass);

    // Call the login logic directly with test credentials
    await performLogin(testUser, testPass);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">

         <div className="button-group">
            {/* New button to test credentials */}
            <button type="button" onClick={handleTestClick} className="login-button test-button">
              Test Credentials (for recruiters)
            </button>
        </div>
        <h2>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="login-input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
        />
        <div className="button-group">
            <button type="submit" className="login-button">Login</button>
            
        </div>
      </form>
    </div>
  );
};

export default Login;

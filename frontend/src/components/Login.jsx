
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { login } from '../api';
// import './Login.css';

// const Login = ({ setToken }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await performLogin(username, password);
//   };

//   const performLogin = async (user, pass) => {
//     setLoading(true);
//     try {
//       const response = await login(user, pass);
//       localStorage.setItem('token', response.data.access);
//       setToken(response.data.access);
//       navigate('/dashboard');
//     } catch (error) {
//       console.error('Login failed:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleTestClick = async () => {
//     const testUser = 'test_cred';
//     const testPass = 'test_cred';

//     setUsername(testUser);
//     setPassword(testPass);

//     await performLogin(testUser, testPass);
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit} className="login-form">
//         <div className="button-group">
//           <button type="button" onClick={handleTestClick} className="login-button test-button" disabled={loading}>
//             {loading ? 'Loading...' : 'Test Credentials (for recruiters)'}
//           </button>
//         </div>
//         <h2>Login</h2>
//         <input
//           type="text"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           placeholder="Username"
//           className="login-input"
//         />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           className="login-input"
//         />
//         <div className="button-group">
//           <button type="submit" className="login-button" disabled={loading}>
//             {loading ? 'Loading...' : 'Login'}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;







import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';
import './Login.css';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    await performLogin(username, password);
  };

  const performLogin = async (user, pass) => {
    if (!user || !pass) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await login(user, pass);
      localStorage.setItem('token', response.data.access);
      setToken(response.data.access);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTestClick = async () => {
    const testUser = 'test_cred';
    const testPass = 'test_cred';

    setUsername(testUser);
    setPassword(testPass);
    setError('');

    await performLogin(testUser, testPass);
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-header">
          <div className="logo">
            <div className="logo-icon"></div>
            <h1>Welcome Back</h1>
          </div>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="login-input"
              disabled={loading}
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="login-input"
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-button primary" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="divider">
            <span>or</span>
          </div>

          <button 
            type="button" 
            onClick={handleTestClick} 
            className="login-button secondary" 
            disabled={loading}
          >
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <>
                <span className="test-icon">🚀</span>
                Use Test Credentials
              </>
            )}
          </button>
          
          <p className="test-note">For recruiters and demo purposes</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function LoginPage({ setToken, setIsAdmin, setUsername }) {
  const [localUsername, setLocalUsername] = useState('');  // Renamed to avoid conflict
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5236/api/account/login', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify({ username: localUsername, password }), // Use localUsername here
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        setIsAdmin(data.username === 'admin');
        setUsername(data.username); // Set username after login
        setError('');
        // Redirect based on admin status
        navigate(data.username === 'admin' ? '/admin-home' : '/user-home');
      } else {
        const data = await response.json();
        setError(`Login failed: ${data.message}`);
      }
    } catch (err) {
      setError(`Login error: ${err.message}`);
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      fontFamily: 'Arial, sans-serif',
    },
    title: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    inputContainer: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
    },
    button: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#007BFF',
      color: '#fff',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    error: {
      color: 'red',
      marginTop: '10px',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            name="Username"
            value={localUsername}  // Use localUsername here
            onChange={(e) => setLocalUsername(e.target.value)} // Update localUsername state
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Login
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

export default LoginPage;
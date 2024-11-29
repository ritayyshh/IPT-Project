import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5236/api/account/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 || response.status === 201) {
        setMessage('Registration successful!');
        setIsSuccess(true);
      } else {
        setMessage('Registration failed.');
        setIsSuccess(false);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'An error occurred.';
      setMessage(`Error: ${errorMsg}`);
      setIsSuccess(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '450px',
      margin: '50px auto',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
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
      fontWeight: 'bold',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      boxSizing: 'border-box',
      outline: 'none',
    },
    inputFocus: {
      border: '1px solid #007BFF',
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
      fontSize: '16px',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    message: {
      marginTop: '20px',
      textAlign: 'center',
      fontSize: '14px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.inputContainer}>
          <label style={styles.label}>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
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
          Register
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
      {message && (
        <div
          style={{
            ...styles.message,
            color: isSuccess ? 'green' : 'red',
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default RegisterPage;

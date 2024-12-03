import React, { useState } from 'react';
import axios from 'axios';

const AddRestaurant = ({ handleLogout }) => {
  const [restaurantData, setRestaurantData] = useState({
    name: '',
    location: '',
    description: '',
    contactNumber: ''
  });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (e) => {
    setRestaurantData({
      ...restaurantData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5236/api/Restaurants', restaurantData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResponseMessage("Restaurant added successfully!");
      setRestaurantData({ name: '', location: '', description: '', contactNumber: '' }); // Reset form
    } catch (error) {
      setResponseMessage("Failed to add restaurant.");
    }
  };

  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '500px',
      margin: 'auto',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9'
    },
    header: {
      color: '#333',
      marginBottom: '20px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    label: {
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#555'
    },
    input: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      fontSize: '16px',
      width: '100%'
    },
    button: {
      padding: '10px 20px',
      borderRadius: '5px',
      border: 'none',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backgroundColor: '#4CAF50',
      color: 'white'
    },
    logoutButton: {
      backgroundColor: '#ff4d4d',
      color: 'white',
      marginBottom: '20px'
    },
    message: {
      marginTop: '20px',
      fontSize: '16px',
      color: '#007BFF'
    }
  };

  return (
    <div style={styles.container}>
      <button onClick={handleLogout} style={{ ...styles.button, ...styles.logoutButton }}>
        Logout
      </button>
      <h1 style={styles.header}>Add a New Restaurant</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div>
          <label style={styles.label}>Name</label>
          <input
            type="text"
            name="name"
            value={restaurantData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div>
          <label style={styles.label}>Location</label>
          <input
            type="text"
            name="location"
            value={restaurantData.location}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div>
          <label style={styles.label}>Description</label>
          <input
            type="text"
            name="description"
            value={restaurantData.description}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <div>
          <label style={styles.label}>Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={restaurantData.contactNumber}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Add Restaurant
        </button>
      </form>
      {responseMessage && <p style={styles.message}>{responseMessage}</p>}
    </div>
  );
};

export default AddRestaurant;
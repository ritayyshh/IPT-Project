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
      const response = await axios.post('http://localhost:5236/api/Restaurants', restaurantData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setResponseMessage("Restaurant added successfully!");
      console.log(response.data); // Log the response from the API
    } catch (error) {
      setResponseMessage("Failed to add restaurant.");
      console.error("Error:", error);
    }
  };
  const styles = {
    button: {
      padding: "10px 15px",
      borderRadius: "5px",
      margin: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: "#ff4d4d" }}>
        Logout
      </button>
      <h1>Add a New Restaurant</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input
            type="text"
            name="name"
            value={restaurantData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Location: </label>
          <input
            type="text"
            name="location"
            value={restaurantData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            name="description"
            value={restaurantData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Contact Number: </label>
          <input
            type="text"
            name="contactNumber"
            value={restaurantData.contactNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', marginTop: '20px' }}>
          Add Restaurant
        </button>
      </form>
      <p>{responseMessage}</p>
    </div>
  );
};

export default AddRestaurant;
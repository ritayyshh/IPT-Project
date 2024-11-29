import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const AdminHomePage = ({ handleLogout }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch restaurants data on component mount
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:5236/api/Restaurants");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleAddRestaurant = () => {
    navigate('/add-restaurant');
  };

  const handleViewRestaurant = (id) => {
    navigate(`/adminrestaurants/${id}`);
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const response = await fetch(`http://localhost:5236/api/Restaurants/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete restaurant');
      }
      // Update the state to remove the deleted restaurant
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.restaurantID !== id)
      );
    } catch (err) {
      alert(`Error deleting restaurant: ${err.message}`);
    }
  };

  // Styles for the components
  const styles = {
    restaurantCard: {
      backgroundColor: '#fff',
      padding: '15px',
      margin: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease',
    },
    restaurantName: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#333',
    },
    restaurantLocation: {
      color: '#777',
      marginTop: '5px',
    },
    rating: {
      marginTop: '5px',
      fontSize: '16px',
      color: '#f39c12',
    },
    viewButton: {
      backgroundColor: '#3498db',
      color: '#fff',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      marginTop: '15px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: '#fff',
      border: 'none',
      padding: '10px 15px',
      borderRadius: '5px',
      marginTop: '10px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '20px',
    },
    loading: {
      fontSize: '20px',
      color: '#3498db',
    },
    error: {
      color: '#e74c3c',
      fontSize: '16px',
    },
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Welcome, Admin!</h1>

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 20px',
            margin: '10px',
            backgroundColor: '#ff4d4d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
        <button
          onClick={handleAddRestaurant}
          style={{
            padding: '10px 20px',
            margin: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Add Restaurant
        </button>
      </div>

      {/* Restaurant List Section */}
      <div style={styles.container}>
        {isLoading && <p style={styles.loading}>Loading restaurants...</p>}
        {error && <p style={styles.error}>Error: {error}</p>}
        {!isLoading && !error && restaurants.length === 0 && (
          <p>No restaurants found.</p>
        )}
        {!isLoading &&
          !error &&
          restaurants.length > 0 &&
          restaurants.map((restaurant) => (
            <div key={restaurant.restaurantID} style={styles.restaurantCard}>
              <div style={styles.restaurantName}>{restaurant.name}</div>
              <div style={styles.restaurantLocation}>
                Location: {restaurant.location}
              </div>
              <div style={styles.rating}>
                Average Rating: {restaurant.averageRating || 'N/A'}
              </div>
              <button
                style={styles.viewButton}
                onClick={() => handleViewRestaurant(restaurant.restaurantID)}
              >
                View Restaurant
              </button>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteRestaurant(restaurant.restaurantID)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AdminHomePage;

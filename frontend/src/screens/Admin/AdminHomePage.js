import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminHomePage = ({ handleLogout }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // For editing
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

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
    navigate("/add-restaurant");
  };

  const handleViewRestaurant = (id) => {
    navigate(`/adminrestaurants/${id}`);
  };

  const handleDeleteRestaurant = async (id) => {
    try {
      const response = await fetch(`http://localhost:5236/api/Restaurants/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete restaurant");
      }
      setRestaurants((prevRestaurants) =>
        prevRestaurants.filter((restaurant) => restaurant.restaurantID !== id)
      );
    } catch (err) {
      alert(`Error deleting restaurant: ${err.message}`);
    }
  };

  const handleEditRestaurant = async (id) => {
    try {
      const response = await fetch(`http://localhost:5236/api/Restaurants/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch restaurant details");
      }
      const data = await response.json();
      setSelectedRestaurant(data);
      setShowModal(true);
    } catch (err) {
      alert(`Error fetching restaurant details: ${err.message}`);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5236/api/Restaurants/${selectedRestaurant.restaurantID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedRestaurant),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update restaurant details");
      }
      const updatedRestaurants = restaurants.map((restaurant) =>
        restaurant.restaurantID === selectedRestaurant.restaurantID
          ? selectedRestaurant
          : restaurant
      );
      setRestaurants(updatedRestaurants);
      setShowModal(false);
    } catch (err) {
      alert(`Error updating restaurant: ${err.message}`);
    }
  };

  const styles = {
    restaurantCard: {
      backgroundColor: "#fff",
      padding: "15px",
      margin: "15px",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease",
    },
    restaurantName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#333",
    },
    restaurantLocation: {
      color: "#777",
      marginTop: "5px",
    },
    rating: {
      marginTop: "5px",
      fontSize: "16px",
      color: "#f39c12",
    },
    button: {
      padding: "10px 15px",
      borderRadius: "5px",
      margin: "5px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#f9f9f9",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
      width: "90%",
      maxWidth: "400px",
      zIndex: 1000,
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      border: "1px solid #ddd",
      borderRadius: "8px",
    },
    saveButton: {
      padding: "10px 15px",
      backgroundColor: "#4CAF50",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
      marginRight: "10px",
    },
    cancelButton: {
      padding: "10px 15px",
      backgroundColor: "#e74c3c",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Welcome, Admin!</h1>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleLogout} style={{ ...styles.button, backgroundColor: "#ff4d4d" }}>
          Logout
        </button>
        <button onClick={handleAddRestaurant} style={{ ...styles.button, backgroundColor: "#4CAF50" }}>
          Add Restaurant
        </button>
      </div>

      <div>
        {isLoading && <p>Loading restaurants...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!isLoading &&
          !error &&
          restaurants.map((restaurant) => (
            <div key={restaurant.restaurantID} style={styles.restaurantCard}>
              <div style={styles.restaurantName}>{restaurant.name}</div>
              <div style={styles.restaurantLocation}>Location: {restaurant.location}</div>
              <div style={styles.rating}>
                Average Rating: {restaurant.averageRating || "N/A"}
              </div>
              <button
                onClick={() => handleViewRestaurant(restaurant.restaurantID)}
                style={{ ...styles.button, backgroundColor: "#3498db" }}
              >
                View
              </button>
              <button
                onClick={() => handleEditRestaurant(restaurant.restaurantID)}
                style={{ ...styles.button, backgroundColor: "#f39c12" }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteRestaurant(restaurant.restaurantID)}
                style={{ ...styles.button, backgroundColor: "#e74c3c" }}
              >
                Delete
              </button>
            </div>
          ))}
      </div>

      {showModal && (
        <>
          <div style={styles.overlay} onClick={() => setShowModal(false)} />
          <div style={styles.modal}>
            <h3>Edit Restaurant</h3>
            <input
              type="text"
              placeholder="Name"
              value={selectedRestaurant.name}
              onChange={(e) =>
                setSelectedRestaurant({ ...selectedRestaurant, name: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Location"
              value={selectedRestaurant.location}
              onChange={(e) =>
                setSelectedRestaurant({ ...selectedRestaurant, location: e.target.value })
              }
              style={styles.input}
            />
            <textarea
              placeholder="Description"
              value={selectedRestaurant.description}
              onChange={(e) =>
                setSelectedRestaurant({ ...selectedRestaurant, description: e.target.value })
              }
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={selectedRestaurant.contactNumber}
              onChange={(e) =>
                setSelectedRestaurant({ ...selectedRestaurant, contactNumber: e.target.value })
              }
              style={styles.input}
            />
            <button onClick={handleSaveChanges} style={styles.saveButton}>
              Save
            </button>
            <button onClick={() => setShowModal(false)} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHomePage;

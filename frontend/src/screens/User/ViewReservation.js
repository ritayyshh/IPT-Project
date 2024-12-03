import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewReservation = ({ handleLogout }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const { userId } = useParams(); // Extract userId from URL
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:5236/api/TableReservations/byUser/${userId}`);
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [userId]);

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navBar}>
        <div style={styles.navLinks}>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault(); // Prevent the default anchor behavior
              navigate("/user-home"); // Navigate to the desired route
            }}
            style={styles.navLink}
          >
            Home
          </a>
          <a href="#about" style={styles.navLink}>About Us</a>
          <a href="#contact" style={styles.navLink}>Contact Us</a>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </nav>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <h2 style={styles.heading}>Your Reservations</h2>
        <div style={styles.cardContainer}>
          {reservations.length > 0 ? (
            reservations.map((reservation) => (
              <div key={reservation.tableReservationID} style={styles.card}>
                <h3 style={styles.cardTitle}>Restaurant: {reservation.restaurantID}</h3>
                <p style={styles.cardText}>Date: {reservation.reservationDate}</p>
                <p style={styles.cardText}>Time: {reservation.startTime} - {reservation.endTime}</p>
                <p style={styles.cardText}>Party Size: {reservation.partySize}</p>
                <p style={styles.cardText}>Special Requests: {reservation.specialRequests}</p>
              </div>
            ))
          ) : (
            <p style={styles.noReservations}>No reservations found.</p>
          )}
        </div>
      </div>
    </div>

  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column", // Stack navbar and main content vertically
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
  },
  navBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#007BFF",
    padding: "10px 20px",
    color: "white",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    position: "sticky", // Makes navbar stick to the top
    top: 0, // Ensures it stays at the top
    zIndex: 1000, // Keeps it above other elements
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "16px",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
  mainContent: {
    flex: 1,
    padding: "20px",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "15px",
    width: "300px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  cardText: {
    margin: "5px 0",
    fontSize: "14px",
    color: "#555",
  },
  noReservations: {
    textAlign: "center",
    fontSize: "16px",
    color: "#888",
  },
};

export default ViewReservation;

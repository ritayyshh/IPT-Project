import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ViewReservation = ({ handleLogout }) => {
  const navigate = useNavigate(); // Initialize the navigate function
  const { userId } = useParams(); // Extract userId from URL
  const [reservations, setReservations] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null); // State for selected order
  const [showModal, setShowModal] = useState(false); // State for showing modal

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

  const handleViewOrder = async (tableReservationId) => {
    try {
      const response = await axios.get(`http://localhost:5236/api/Orders/byReservation/${tableReservationId}`);
      setSelectedOrder(response.data);
      setShowModal(true);
      console.log(response.data);

    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleDeleteReservation = async (reservationId, tableId) => {
    try {
      const tableResponse = await fetch(`http://localhost:5236/api/Tables/${tableId}`);
      if (!tableResponse.ok) {
        throw new Error("Failed to fetch table details");
      }
      const tableData = await tableResponse.json();
      
      // await axios.delete(`http://localhost:5236/api/TableReservations/${reservationId}`);
      // After deletion, remove the reservation from the state to update the UI
      
      const reservationResponse = await fetch(`http://localhost:5236/api/TableReservations/${reservationId}`, {
        method: "DELETE",
      });
      if (!reservationResponse.ok) {
        throw new Error("Failed to cancel the reservation");
      }
      
      setReservations(reservations.filter(reservation => reservation.tableReservationID !== reservationId));

      

      const tableUpdateResponse = await fetch(`http://localhost:5236/api/Tables/${tableId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json-patch+json",
        },
        body: JSON.stringify({
          seatingCapacity: tableData.seatingCapacity,
          isAvailable: true,
        }),
      });
      if (!tableUpdateResponse.ok) {
        throw new Error("Failed to update table availability");
      }

      alert('Reservation deleted successfully');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Failed to delete reservation');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

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
                <h3 style={styles.cardTitle}>Restaurant Name: {reservation.restaurantName}</h3>
                <p style={styles.cardText}>Date: {reservation.reservationDate}</p>
                <p style={styles.cardText}>Time: {reservation.startTime} - {reservation.endTime}</p>
                <p style={styles.cardText}>Party Size: {reservation.partySize}</p>
                <p style={styles.cardText}>Special Requests: {reservation.specialRequests}</p>
                <div style={styles.buttonContainer}>
                  <button 
                    onClick={() => handleViewOrder(reservation.tableReservationID)} 
                    style={styles.viewOrderButton}
                  >
                    View Order
                  </button>
                  <button
                    onClick={() => handleDeleteReservation(reservation.tableReservationID, reservation.tableID)}
                    style={styles.deleteButton}
                  >
                    Delete Reservation
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noReservations}>No reservations found.</p>
          )}
        </div>
      </div>

      {/* Modal for Order Details */}
      {showModal && selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>Order Details for Reservation</h3>
            <p><strong>Restaurant Name:</strong> {selectedOrder[0].restaurantName}</p>
            <p><strong>Order Date:</strong> {new Date(selectedOrder[0].orderDate).toLocaleString()}</p>
            <p><strong>Total Amount:</strong> PKR {selectedOrder[0].totalAmount}</p>
            <p><strong>Order Status:</strong> {selectedOrder[0].orderStatus}</p>
            <h4>Order Items:</h4>
            <ul>
              {/* Check if orderItems exists and is an array */}
              {Array.isArray(selectedOrder[0].orderItems) && selectedOrder[0].orderItems.length > 0 ? (
                selectedOrder[0].orderItems.map(item => (
                  <li key={item.orderItemID}>
                    <strong>{item.menuItemName}</strong> (x{item.quantity})
                  </li>
                ))
              ) : (
                <p>No items found in the order.</p>
              )}
            </ul>
            <button onClick={closeModal} style={styles.closeModalButton}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
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
    position: "sticky",
    top: 0,
    zIndex: 1000,
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
  viewOrderButton: {
    backgroundColor: "#28a745",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    marginLeft: "10px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000, // Ensure modal is on top of other elements
  },
  modal: {
    backgroundColor: "white",
    padding: "30px", // Increased padding for better spacing
    borderRadius: "12px", // Rounded corners for a softer look
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    minWidth: "400px",
  },
  closeModalButton: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default ViewReservation;

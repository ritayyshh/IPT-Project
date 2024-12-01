import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ViewReservation = () => {
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
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    width: '300px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardText: {
    margin: '5px 0',
    fontSize: '14px',
    color: '#555',
  },
  noReservations: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#888',
  },
};

export default ViewReservation;

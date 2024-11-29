import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";

const ViewRestaurantTables = () => {
  const today = new Date().toISOString().split("T")[0];
  const { restaurantID } = useParams();
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [reservationDetails, setReservationDetails] = useState({
    reservationDate: "",
    startTime: "",
    endTime: "",
    partySize: 0,
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  const fetchTables = useCallback(async () => {
    try {
      const response = await fetch(
        `http://localhost:5236/api/Tables/Restaurant/${restaurantID}`
      );
      const data = await response.json();
      if (data.length > 0) {
        const availableTables = data.filter((table) => table.isAvailable);
        setTables(availableTables);
      }
    } catch (err) {
      console.error("Error fetching tables:", err);
      setError("Failed to fetch tables.");
    } finally {
      setIsLoading(false);
    }
  }, [restaurantID]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userIdFromUrl = urlParams.get("userId");
    const usernameFromUrl = urlParams.get("username");
    if (userIdFromUrl) setUserId(userIdFromUrl);
    if (usernameFromUrl) setUsername(usernameFromUrl);

    fetchTables();
  }, [location.search, fetchTables]);

  const handleReserve = (table) => {
    setSelectedTable(table);
  };

  const handleSubmitReservation = async () => {
    if (!selectedTable) {
      console.error("No table selected for reservation.");
      return;
    }

    const { tableID, seatingCapacity } = selectedTable;

    // Validate reservation details
    const { reservationDate, startTime, endTime, partySize } = reservationDetails;

    if (startTime >= endTime) {
      alert("Start time must be earlier than end time.");
      return;
    }

    if (partySize > seatingCapacity) {
      alert(`Party size cannot exceed seating capacity of ${seatingCapacity}.`);
      return;
    }

    if (reservationDate < today) {
      alert("Reservation date must be today or later.");
      return;
    }

    const reservationData = {
      tableID: tableID,
      userID: userId,
      username: username,
      restaurantID: parseInt(restaurantID, 10),
      reservationDate: reservationDate,
      startTime: startTime,
      endTime: endTime,
      partySize: partySize,
      specialRequests: reservationDetails.specialRequests,
    };

    const updatedTableData = {
      seatingCapacity,
      isAvailable: false,
    };

    try {
      setIsSubmitting(true);

      // Log the request payload for debugging
      // console.log("Reservation Data:", reservationData);

      // POST request to create reservation
      const reservationResponse = await fetch(
        "http://localhost:5236/api/TableReservations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(reservationData),
        }
      );

      if (!reservationResponse.ok) {
        const errorMessage = await reservationResponse.text();
        throw new Error(
          `Failed to create reservation. Server responded with: ${errorMessage}`
        );
      }

      // PUT request to update table availability
      const updateTableResponse = await fetch(
        `http://localhost:5236/api/Tables/${tableID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTableData),
        }
      );

      if (!updateTableResponse.ok) {
        throw new Error("Failed to update table availability.");
      }

      // Refresh table list
      fetchTables();

      // Reset form state
      setSelectedTable(null);
      setReservationDetails({
        reservationDate: "",
        startTime: "",
        endTime: "",
        partySize: 0,
        specialRequests: "",
      });
      setError(null);
    } catch (err) {
      console.error("Error submitting reservation:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservationDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
    },
    tableCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "15px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    tableDetails: {
      fontSize: "16px",
      color: "#555",
    },
    reserveButton: {
      padding: "10px 15px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
    },
    formContainer: {
      marginTop: "15px",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    formInput: {
      width: "100%",
      padding: "10px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      fontSize: "14px",
    },
    submitButton: {
      padding: "10px 15px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
    },
  };

  if (isLoading) {
    return <div style={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.container}>Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Available Tables</h1>
      {tables.length > 0 ? (
        tables.map((table) => (
          <div key={table.tableID} style={styles.tableCard}>
            <div>
              <p style={styles.tableDetails}>Table ID: {table.tableID}</p>
              <p style={styles.tableDetails}>
                Seating Capacity: {table.seatingCapacity}
              </p>
            </div>
            <button
              style={styles.reserveButton}
              onClick={() => handleReserve(table)}
            >
              Reserve
            </button>
          </div>
        ))
      ) : (
        <p style={styles.tableDetails}>No tables available.</p>
      )}

      {selectedTable && (
        <div style={styles.formContainer}>
          <h3>Reserve Table {selectedTable.tableID}</h3>
          <label>Date:</label>
          <input
            type="date"
            name="reservationDate"
            style={styles.formInput}
            value={reservationDetails.reservationDate}
            onChange={handleChange}
            min={today} // Set the minimum date to today
          />
          <label>Start Time:</label>
          <input
            type="time"
            name="startTime"
            style={styles.formInput}
            value={reservationDetails.startTime}
            onChange={handleChange}
          />
          <label>End Time:</label>
          <input
            type="time"
            name="endTime"
            style={styles.formInput}
            value={reservationDetails.endTime}
            onChange={handleChange}
          />
          <label>Party Size:</label>
          <input
            type="number"
            name="partySize"
            style={styles.formInput}
            value={reservationDetails.partySize}
            onChange={handleChange}
            min="1"
          />
          <label>Special Requests:</label>
          <textarea
            name="specialRequests"
            style={styles.formInput}
            value={reservationDetails.specialRequests}
            onChange={handleChange}
          />
          <button
            style={{
              ...styles.submitButton,
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer",
            }}
            onClick={handleSubmitReservation}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Reservation"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewRestaurantTables;

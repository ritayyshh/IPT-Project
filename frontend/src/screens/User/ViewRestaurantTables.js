import React, { useState, useEffect, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const ViewRestaurantTables = ({ handleLogout }) => {
  const navigate = useNavigate();
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
  const [restaurantData, setRestaurantData] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [showOrderForm, setShowOrderForm] = useState(false);
  const location = useLocation();
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);
  const [reservationID, setReservationID] = useState(null);
  // const [restaurantName, setRestaurantName] = useState(null);
  
  
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

  const fetchRestaurantDetails = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:5236/api/Restaurants/${restaurantID}`);
      const data = await response.json();
      setRestaurantData(data);
      console.log(data.name);
    } catch (err) {
      console.error("Error fetching restaurant details:", err);
      setError("Failed to fetch restaurant details.");
    }
  }, [restaurantID]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userIdFromUrl = urlParams.get("userId");
    const usernameFromUrl = urlParams.get("username");
    if (userIdFromUrl) setUserId(userIdFromUrl);
    if (usernameFromUrl) setUsername(usernameFromUrl);

    fetchTables();
    fetchRestaurantDetails();
  }, [location.search, fetchTables, fetchRestaurantDetails]);

  const fetchTableReservationDetails = async (tableID) => {
    try {
      const response = await fetch(`http://localhost:5236/api/Tables/${tableID}`);
      const tableData = await response.json();
      const lastReservation = tableData.tableReservations[tableData.tableReservations.length - 1];
      console.log(lastReservation.reservationID);
      setReservationID(lastReservation.reservationID);
    } catch (err) {
      console.error("Error fetching table reservation details:", err);
      setError("Failed to fetch table reservation details.");
    }
  };

  const handleReserve = (table) => {
    setSelectedTable(table);
  };

  const handleSubmitReservation = async () => {
    if (!selectedTable) {
      console.error("No table selected for reservation.");
      return;
    }

    const { tableID, seatingCapacity } = selectedTable;
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
      restaurantName: restaurantData.name,
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

      // fetchTables();
      // setSelectedTable(null);
      setReservationDetails({
        reservationDate: "",
        startTime: "",
        endTime: "",
        partySize: 0,
        specialRequests: "",
      });
      setError(null);

      // Fetch reservation details and show the order form
      await fetchTableReservationDetails(tableID);

      // Show the order form after reservation is submitted
      setShowOrderForm(true);
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

  const handleQuantityChange = (menuItemID, operation) => {
    setOrderItems((prevItems) => {
      const newQuantity =
        operation === "increment" ? (prevItems[menuItemID] || 0) + 1 : Math.max(0, (prevItems[menuItemID] || 0) - 1);
      return {
        ...prevItems,
        [menuItemID]: newQuantity,
      };
    });
  };

  const handleSubmitOrder = async () => {
    if (!reservationID || !selectedTable) {
      console.error("Reservation or table details missing.");
      return;
    }
    try {
      // Create order
      const orderData = {
        userID: userId,
        restaurantID: restaurantID,
        tableID: selectedTable.tableID,
        reservationID: reservationID,
        orderDate: new Date().toISOString(),
      };

      const orderResponse = await fetch("http://localhost:5236/api/Orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error("Failed to create order.");
      }

      const { orderID } = await orderResponse.json();

      // Add items to order if quantity >= 1
      for (let itemID in orderItems) {
        const quantity = orderItems[itemID];
        if (quantity > 0) {
          const orderItemData = {
            orderID: orderID,
            menuItemID: itemID,
            quantity: quantity,
          };

          const orderItemResponse = await fetch("http://localhost:5236/api/OrderItems", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderItemData),
          });

          if (!orderItemResponse.ok) {
            throw new Error("Failed to add order items.");
          }
        }
      }
      //
      fetchTables(); 
      setSelectedTable(null);
      // 
      alert("Order submitted successfully.");
      navigate('/user-home');
    } catch (err) {
      console.error("Error submitting order:", err);
      setError(`Error: ${err.message}`);
    }
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
      padding: "8px",
      margin: "10px 0",
      borderRadius: "4px",
      border: "1px solid #ddd",
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
    orderForm: {
      marginTop: "15px",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    menuItemCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "10px",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    menuItemDetails: {
      fontSize: "16px",
      color: "#555",
    },
    quantityButton: {
      padding: "5px 10px",
      backgroundColor: "#f0f0f0",
      border: "1px solid #ddd",
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
        <h1 style={styles.header}>Available Tables</h1>
        {tables.length > 0 ? (
          tables.map((table) => (
            <div key={table.tableID} style={styles.tableCard}>
              <div>
                <p style={styles.tableDetails}>Table Number: {table.tableID}</p>
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
              value={reservationDetails.partySize || ""}
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

        {selectedTable && showOrderForm && restaurantData && (
          <div style={styles.orderForm}>
            <h3>Order Menu for Table {selectedTable.tableID} </h3>
            {restaurantData.menuItems.map((item) => (
              <div key={item.menuItemID} style={styles.menuItemCard}>
                <div>
                  <p style={styles.menuItemDetails}>
                    <strong>{item.name}</strong>
                  </p>
                  <p style={styles.menuItemDetails}>{item.description}</p>
                  <p style={styles.menuItemDetails}>PKR {item.price}</p>
                </div>
                <div>
                  <button
                    style={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.menuItemID, "decrement")}
                  >
                    -
                  </button>
                  <span style={{ margin: "0 10px" }}>
                    {orderItems[item.menuItemID] || 0}
                  </span>
                  <button
                    style={styles.quantityButton}
                    onClick={() => handleQuantityChange(item.menuItemID, "increment")}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <button style={styles.submitButton} onClick={handleSubmitOrder}>
              Submit Order
            </button>
          </div>
        )}
        </div>
      </div>
  );
};

export default ViewRestaurantTables;
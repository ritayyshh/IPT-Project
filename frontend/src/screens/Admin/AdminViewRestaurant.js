import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AdminViewRestaurant = ({ handleLogout }) => {
  const [reservationDetails, setReservationDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const viewReservationDetails = async (tableID) => {
    try {
      // First API call: Get table information with reservation details
      const tableResponse = await fetch(`http://localhost:5236/api/Tables/${tableID}`);
      if (!tableResponse.ok) {
        throw new Error("Failed to fetch table details");
      }
      const tableData = await tableResponse.json();
  
      // Assuming tableData has reservationID
      const reservationID = tableData.tableReservations[0]?.reservationID;
  
      if (!reservationID) {
        alert("No reservation found for this table.");
        return;
      }
  
      // Second API call: Get detailed reservation information
      const reservationResponse = await fetch(
        `http://localhost:5236/api/TableReservations/${reservationID}`
      );
      if (!reservationResponse.ok) {
        throw new Error("Failed to fetch reservation details");
      }
  
      const reservationData = await reservationResponse.json();
      setReservationDetails(reservationData); // Store the reservation details in state
      setShowPopup(true); // Display the popup with the details
    } catch (err) {
      alert(err.message);
    }
  };

  const ReservationPopup = ({ reservationDetails, onClose }) => {
    return (
      <div style={popupStyles.overlay}>
        <div style={popupStyles.popup}>
          <h3>Reservation Details</h3>
          {/* <p><strong>Reservation ID:</strong> {reservationDetails?.tableReservationID}</p> */}
          <p><strong>Table Number:</strong> {reservationDetails?.tableID}</p>
          <p><strong>Restaurant Name: {reservationDetails?.restaurantName}</strong></p>
          <p><strong>User: {reservationDetails?.username}</strong></p>
          
          {/* <p><strong>Restaurant ID:</strong> {reservationDetails?.restaurantID}</p> */}
          {/* <p><strong>Username:</strong> {reservationDetails?.username}</p> */}
          <p><strong>Reservation Date:</strong> {reservationDetails?.reservationDate}</p>
          <p><strong>Start Time:</strong> {reservationDetails?.startTime}</p>
          <p><strong>End Time:</strong> {reservationDetails?.endTime}</p>
          <p><strong>Party Size:</strong> {reservationDetails?.partySize}</p>
          <p><strong>Special Requests:</strong> {reservationDetails?.specialRequests}</p>
          <button onClick={onClose} style={popupStyles.closeButton}>Close</button>
        </div>
      </div>
    );
  };

  const popupStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    popup: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "400px",
      maxWidth: "90%",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    closeButton: {
      marginTop: "20px",
      padding: "8px 12px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  const handleCancelReservation = async (tableID) => {
    try {
      // Step 1: Fetch table details to get the reservationID
      const tableResponse = await fetch(`http://localhost:5236/api/Tables/${tableID}`);
      if (!tableResponse.ok) {
        throw new Error("Failed to fetch table details");
      }
      const tableData = await tableResponse.json();
  
      // Get the reservationID from the table's reservation
      const reservationID = tableData.tableReservations[0]?.reservationID;
      if (!reservationID) {
        alert("No reservation found for this table.");
        return;
      }
  
      // Step 2: Delete the reservation using the reservationID
      const reservationResponse = await fetch(`http://localhost:5236/api/TableReservations/${reservationID}`, {
        method: "DELETE",
      });
      if (!reservationResponse.ok) {
        throw new Error("Failed to cancel the reservation");
      }
  
      // Step 3: Update the table's availability to true
      const tableUpdateResponse = await fetch(`http://localhost:5236/api/Tables/${tableID}`, {
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
  
      // Optionally, update local state or UI to reflect changes
      alert("Reservation canceled and table is now available.");
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.tableID === tableID
            ? { ...table, isAvailable: true, tableReservations: [] }
            : table
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };
  
  const handleDeleteTable = async (tableID) => {
    try {
      const response = await fetch(`http://localhost:5236/api/Tables/${tableID}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete table");
      }
      alert("Table deleted successfully.");
      setTables((prevTables) =>
        prevTables.filter((table) => table.tableID !== tableID)
      );
    } catch (err) {
      alert(err.message);
    }
  };
  
  const [editItem, setEditItem] = useState(null); // State to handle the item being edited
  const [editValues, setEditValues] = useState({ name: "", description: "", price: "" }); // State for edit form values
  
  const handleEditClick = (item) => {
    setEditItem(item);
    setEditValues({
      name: item.name,
      description: item.description,
      price: item.price,
    });
  };
  
  const handleSave = async () => {
    try {
      const response = await fetch(
        `http://localhost:5236/api/MenuItems/${editItem.menuItemID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(editValues),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update menu item.");
      }

      // Update state after successful edit
      setRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        menuItems: prevRestaurant.menuItems.map((menuItem) =>
          menuItem.menuItemID === editItem.menuItemID
            ? { ...menuItem, ...editValues }
            : menuItem
        ),
      }));

      // Close the popup
      setEditItem(null);
    } catch (error) {
      alert(error.message);
    }
  };

  const [currentEditingTable, setCurrentEditingTable] = useState(null); // The table being edited
  const [editingTableValues, setEditingTableValues] = useState({
    seatingCapacity: 0,
  }); // Values being edited
  const openTableEditPopup = (table) => {
    setCurrentEditingTable(table); // Set the current table being edited
    setEditingTableValues({
      seatingCapacity: table.seatingCapacity, // Load current seatingCapacity
    });
  };
  
  const saveEditedTable = async () => {
    if (!currentEditingTable) return;
  
    try {
      const response = await fetch(`http://localhost:5236/api/Tables/${currentEditingTable.tableID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seatingCapacity: parseInt(editingTableValues.seatingCapacity, 10),
          isAvailable: currentEditingTable.isAvailable, // Keep isAvailable unchanged
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update table.");
      }
  
      // Update state after saving
      setTables((prevTables) =>
        prevTables.map((table) =>
          table.tableID === currentEditingTable.tableID
            ? { ...table, seatingCapacity: parseInt(editingTableValues.seatingCapacity, 10) }
            : table
        )
      );
  
      setCurrentEditingTable(null); // Close popup
    } catch (error) {
      alert(error.message);
    }
  };

  const [ViewOrderIsModalOpen, setViewOrderIsModalOpen] = useState(false);
  const [ViewOrderDetails, setViewOrderDetails] = useState(null);
  const [ViewOrderLoading, setViewOrderLoading] = useState(false);
  const [ViewOrderError, setViewOrderError] = useState(null);

  // Fetch order details
  const handleViewOrderClick = async (ViewOrderTableID) => {
    setViewOrderLoading(true);
    setViewOrderError(null);

    try {
      const response = await fetch(`http://localhost:5236/api/Orders/table/${ViewOrderTableID}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const data = await response.json();
      setViewOrderDetails(data);
    } catch (err) {
      setViewOrderError(err.message);
    } finally {
      setViewOrderLoading(false);
      setViewOrderIsModalOpen(true); // Open modal regardless of success
    }
  };

  // Close modal
  const handleCloseModal = () => {
    setViewOrderIsModalOpen(false);
    setViewOrderDetails(null);
    setViewOrderError(null);
  };





  const { restaurantID } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tables, setTables] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [newTable, setNewTable] = useState({
    seatingCapacity: 0,
    isAvailable: true,
  });
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const [restaurantResponse, tablesResponse] = await Promise.all([
          fetch(`http://localhost:5236/api/Restaurants/${restaurantID}`),
          fetch(`http://localhost:5236/api/Tables/Restaurant/${restaurantID}`),
        ]);

        if (!restaurantResponse.ok) {
          throw new Error("Failed to fetch restaurant details");
        }

        const restaurantData = await restaurantResponse.json();
        const tablesData = await tablesResponse.json();

        setRestaurant(restaurantData);
        setTables(tablesData.length > 0 ? tablesData : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantID]);

  const handleAddMenuItem = async () => {
    try {
      const response = await fetch("http://localhost:5236/api/MenuItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantID: restaurantID,
          ...newMenuItem,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add menu item");
      }

      const addedMenuItem = await response.json();
      setRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        menuItems: [...prevRestaurant.menuItems, addedMenuItem],
      }));
      setNewMenuItem({ name: "", description: "", price: 0 });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddTable = async () => {
    try {
      const response = await fetch("http://localhost:5236/api/Tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantID: restaurantID,
          ...newTable,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add table");
      }

      const addedTable = await response.json();
      setTables((prevTables) => [...prevTables, addedTable]);
      setNewTable({ seatingCapacity: 0, isAvailable: true });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteReview = async (reviewID) => {
    try {
      const response = await fetch(`http://localhost:5236/api/Reviews/${reviewID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete review");
      }

      // Remove the deleted review from the state
      setRestaurant((prevRestaurant) => ({
        ...prevRestaurant,
        reviews: prevRestaurant.reviews.filter(
          (review) => review.reviewID !== reviewID
        ),
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      padding: "20px",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
    },
    headerContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#333",
    },
    section: {
      marginBottom: "20px",
      padding: "15px",
      backgroundColor: "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
    },
    sectionHeader: {
      fontSize: "20px",
      fontWeight: "bold",
      marginBottom: "10px",
      color: "#007BFF",
    },
    detailText: {
      fontSize: "16px",
      color: "#555",
    },
    menuItem: {
      fontSize: "16px",
      marginBottom: "8px",
      display: "flex",
      justifyContent: "space-between",
    },
    button: {
      padding: "10px 15px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    deleteButton: {
      padding: "5px 10px",
      backgroundColor: "#FF4D4D",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginTop: "10px",
    },
    input: {
      padding: "8px",
      margin: "5px",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    reviewCard: {
      padding: "10px",
      marginBottom: "10px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    reviewText: {
      fontSize: "14px",
      color: "#555",
    },
    reservationButton: {
      padding: "8px 12px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "5px",
    },
    ViewOrderButton: {
      padding: "8px 12px",
      backgroundColor: "green",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      marginRight: "5px",
    },
    ModalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    ModalContent: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      width: "500px",
      maxWidth: "90%",
      textAlign: "left",
    },
    CloseButton: {
      backgroundColor: "#ff4d4f",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      padding: "5px 10px",
      cursor: "pointer",
    },
    cancelButton: {
      padding: "8px 12px",
      backgroundColor: "#FF4D4D",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    tableCard: {
      padding: "10px",
      marginBottom: "10px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      borderRadius: "5px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    LogoutButton: {
      padding: "10px 15px",
      borderRadius: "5px",
      margin: "5px",
      cursor: "pointer",
      fontWeight: "bold",
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
      <button onClick={handleLogout} style={{ ...styles.LogoutButton, backgroundColor: "#ff4d4d" }}>
        Logout
      </button>
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>{restaurant?.name || "Restaurant Details"}</h1>
      </div>
      {/* Details Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Details</h2>
        <p style={styles.detailText}>Location: {restaurant?.location}</p>
        <p style={styles.detailText}>Contact: {restaurant?.contactNumber}</p>
        <p style={styles.detailText}>Description: {restaurant?.description}</p>
        <p style={styles.detailText}>
          Average Rating: {restaurant?.averageRating}
        </p>
      </div>

      {/* Menu Items Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Menu Items</h2>
        {restaurant?.menuItems?.length > 0 ? (
          restaurant.menuItems.map((item) => (
            <div
              key={item.menuItemID}
              style={{
                ...styles.menuItem,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ccc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <span style={{ fontSize: "16px", fontWeight: "500" }}>{item.name}</span>
                <span style={{ fontSize: "16px", fontWeight: "500" }}>{item.description}</span>
                <span style={{ fontSize: "16px", fontWeight: "500", color: "#4CAF50" }}>
                  PKR {item.price}
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                    marginLeft: "10px",
                  }}
                  onClick={async () => {
                    try {
                      // DELETE request API
                      const response = await fetch(`http://localhost:5236/api/MenuItems/${item.menuItemID}`, {
                        method: "DELETE",
                      });
                      if (!response.ok) {
                        throw new Error("Failed to delete menu item.");
                      }

                      // Update state after deletion
                      setRestaurant((prevRestaurant) => ({
                        ...prevRestaurant,
                        menuItems: prevRestaurant.menuItems.filter(
                          (menuItem) => menuItem.menuItemID !== item.menuItemID
                        ),
                      }));
                    } catch (error) {
                      alert(error.message);
                    }
                  }}
                >
                  Delete
                </button>
                <button
                  style={{
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleEditClick(item)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.detailText}>No menu items available.</p>
        )}
        {/* Edit Popup Modal */}
        {editItem && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2>Edit Menu Item</h2>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Name:</label>
                <input
                  type="text"
                  value={editValues.name}
                  onChange={(e) =>
                    setEditValues((prev) => ({ ...prev, name: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Description:</label>
                <input
                  type="text"
                  value={editValues.description}
                  onChange={(e) =>
                    setEditValues((prev) => ({ ...prev, description: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>Price:</label>
                <input
                  type="number"
                  value={editValues.price}
                  onChange={(e) =>
                    setEditValues((prev) => ({ ...prev, price: e.target.value }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  onClick={() => setEditItem(null)}
                  style={{
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 15px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 15px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        <h3>Add Menu Item</h3>
        <input
          type="text"
          placeholder="Name"
          style={styles.input}
          value={newMenuItem.name}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Description"
          style={styles.input}
          value={newMenuItem.description}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, description: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Price"
          style={styles.input}
          value={newMenuItem.price}
          onChange={(e) =>
            setNewMenuItem({ ...newMenuItem, price: e.target.value })
          }
        />
        <button style={styles.button} onClick={handleAddMenuItem}>
          Add Menu Item
        </button>
      </div>

      {/* Tables Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Tables</h2>
        {tables.length > 0 ? (
          tables.map((table) => (
            <div key={table.tableID} style={styles.tableCard}>
              <div>
                <p style={styles.detailText}>Table Number: {table.tableID}</p>
                <p style={styles.detailText}>
                  Seating Capacity: {table.seatingCapacity}
                </p>
                <p style={styles.detailText}>
                  Status: {table.isAvailable ? "Available" : "Reserved"}
                </p>
              </div>
              {!table.isAvailable && (
                <div>
                  <>
                  <button 
                    style={styles.ViewOrderButton}
                    onClick={() => handleViewOrderClick(table.tableID)} // Pass tableID explicitly
                  >
                    View Order
                  </button>
                  {/* Modal for displaying order details */}
                  {ViewOrderIsModalOpen && (
                    <div style={styles.ModalOverlay}>
                      <div style={styles.ModalContent}>
                        <button
                          style={styles.CloseButton}
                          onClick={handleCloseModal}
                        >
                          Close
                        </button>

                        {/* Loading state */}
                        {ViewOrderLoading && <p>Loading...</p>}

                        {/* Error state */}
                        {ViewOrderError && (
                          <p style={{ color: "red" }}>
                            Error: {ViewOrderError}
                          </p>
                        )}

                        {/* Order details */}
                        {ViewOrderDetails && (
                          <div>
                            <h2>Order Details</h2>
                            {ViewOrderDetails.map((order) => (
                              <div key={order.orderID}>
                                <p><strong>Order Number:</strong> {order.orderID}</p>
                                <p><strong>Restaurant:</strong> {order.restaurantName}</p>
                                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                                <p><strong>Total Amount:</strong> PKR {order.totalAmount}</p>
                                <p><strong>Order Status:</strong> {order.orderStatus}</p>
                                <h3>Order Items:</h3>
                                <ul>
                                  {order.orderItems.map((item) => (
                                    <li key={item.orderItemID}>
                                      {item.menuItemName} - Quantity: {item.quantity}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  </>
                  <button style={styles.reservationButton} onClick={() => { console.log(table); viewReservationDetails(table.tableID); }}>
                    View Reservation
                  </button>
                  {showPopup && (
                    <ReservationPopup
                      reservationDetails={reservationDetails}
                      onClose={() => setShowPopup(false)} // Close the popup
                    />
                  )}
                  <button style={styles.cancelButton} onClick={() => handleCancelReservation(table.tableID)}>
                    Cancel Reservation
                  </button>
                </div>
              )}
              {/*  */}
              {table.isAvailable ? (
              <>
                <button
                  style={{
                    ...styles.editButton,
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                  onClick={() => openTableEditPopup(table)}
                >
                  Edit
                </button>
                <button
                  style={styles.deleteButton}
                  onClick={() => handleDeleteTable(table.tableID)}
                >
                  Delete Table
                </button>
              </>
              ) : (null)}
              {/*  */}
            </div>
          ))
        ) : (
          <p style={styles.detailText}>No tables available.</p>
        )}
        {/* Edit Popup Modal */}
        {currentEditingTable && (
          <div
            style={{
              position: "fixed",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                width: "400px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h2>Edit Seating Capacity</h2>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>
                  Seating Capacity:
                </label>
                <input
                  type="number"
                  value={editingTableValues.seatingCapacity}
                  onChange={(e) =>
                    setEditingTableValues((prev) => ({
                      ...prev,
                      seatingCapacity: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button
                  onClick={() => setCurrentEditingTable(null)}
                  style={{
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 15px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditedTable}
                  style={{
                    backgroundColor: "#007BFF",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "8px 15px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
        
        <h3>Add Table</h3>
        <input
          type="number"
          placeholder="Seating Capacity"
          style={styles.input}
          value={newTable.seatingCapacity || ""}
          onChange={(e) =>
            setNewTable({ ...newTable, seatingCapacity: e.target.value })
          }
        />
        <button style={styles.button} onClick={handleAddTable}>
          Add Table
        </button>
      </div>

      {/* Reviews Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Reviews</h2>
        <button style={styles.button} onClick={() => setShowReviews(!showReviews)}>
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </button>
        {showReviews && restaurant?.reviews?.length > 0 ? (
          restaurant.reviews.map((review) => (
            <div key={review.reviewID} style={styles.reviewCard}>
              <p style={styles.reviewText}>
                {/* <strong>User:</strong> {review.userName} */}
                <strong>User:</strong> {review.userName}
              </p>
              <p style={styles.reviewText}>
                <strong>Rating:</strong> {review.rating}
              </p>
              <p style={styles.reviewText}>
                <strong>Comment:</strong> {review.comment}
              </p>
              <p style={styles.reviewText}>
                <strong>Date:</strong>{" "}
                {new Date(review.reviewDate).toLocaleDateString()}
              </p>
              <button
                style={styles.deleteButton}
                onClick={() => handleDeleteReview(review.reviewID)}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          showReviews && <p style={styles.detailText}>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminViewRestaurant;
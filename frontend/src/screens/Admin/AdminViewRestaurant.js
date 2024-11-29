import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const AdminViewRestaurant = () => {
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
        // if (!tablesResponse.ok) {
        //   throw new Error("Failed to fetch tables");
        // }

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
    input: {
      padding: "8px",
      margin: "5px",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    tableCard: {
      padding: "10px",
      marginBottom: "10px",
      backgroundColor: "#f9f9f9",
      border: "1px solid #ddd",
      borderRadius: "5px",
    },
    tableDetails: {
      fontSize: "16px",
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
      <div style={styles.headerContainer}>
        <h1 style={styles.header}>{restaurant?.name || "Restaurant Details"}</h1>
      </div>
      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Details</h2>
        <p style={styles.detailText}>Location: {restaurant?.location}</p>
        <p style={styles.detailText}>Contact: {restaurant?.contactNumber}</p>
        <p style={styles.detailText}>Description: {restaurant?.description}</p>
        <p style={styles.detailText}>
          Average Rating: {restaurant?.averageRating}
        </p>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Menu Items</h2>
        {restaurant?.menuItems?.length > 0 ? (
          restaurant.menuItems.map((item) => (
            <div key={item.menuItemID} style={styles.menuItem}>
              <span>{item.name}</span>
              <span>PKR {item.price}</span>
            </div>
          ))
        ) : (
          <p style={styles.detailText}>No menu items available.</p>
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

      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Tables</h2>
        {tables.length > 0 ? (
          tables.map((table) => (
            <div key={table.tableID} style={styles.tableCard}>
              <div>
                <p style={styles.tableDetails}>Table ID: {table.tableID}</p>
                <p style={styles.tableDetails}>
                  Seating Capacity: {table.seatingCapacity}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.detailText}>No tables available.</p>
        )}
        <h3>Add Table</h3>
        <input
          type="number"
          placeholder="Seating Capacity"
          style={styles.input}
          value={newTable.seatingCapacity}
          onChange={(e) =>
            setNewTable({ ...newTable, seatingCapacity: e.target.value })
          }
        />
        <button style={styles.button} onClick={handleAddTable}>
          Add Table
        </button>
      </div>
    </div>
  );
};

export default AdminViewRestaurant;
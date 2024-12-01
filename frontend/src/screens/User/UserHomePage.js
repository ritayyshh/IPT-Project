import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const UserHomePage = ({ handleLogout, username }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null); // Store userId
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API to get the userId
    const fetchUserId = async () => {
      try {
        const response = await fetch(`http://localhost:5236/api/account/getUserIdByUsername/${username}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user ID");
        }
        const data = await response.json();
        setUserId(data.userId); // Set userId from the API response
      } catch (err) {
        setError(err.message);
      }
    };

    // Fetch restaurant data
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

    fetchUserId();
    fetchRestaurants();
  }, [username]);

  const styles = {
    container: {
      display: "flex",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
    },
    sidebar: {
      width: isSidebarOpen ? "250px" : "60px",
      backgroundColor: "#fff",
      boxShadow: "2px 0 5px rgba(0, 0, 0, 0.1)",
      padding: "20px 10px",
      overflow: "hidden",
      transition: "width 0.3s ease",
    },
    logoContainer: {
      textAlign: "center",
      marginBottom: "20px",
      cursor: "pointer",
    },
    logo: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
    },
    logoText: {
      fontSize: "16px",
      fontWeight: "bold",
      marginTop: "10px",
      color: "#007BFF",
      transition: "opacity 0.3s ease",
      opacity: isSidebarOpen ? 1 : 0,
    },
    mainContent: {
      flex: 1,
      padding: "20px",
    },
    navBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#007BFF",
      padding: "10px 20px",
      color: "white",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
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
    sidebarLinks: {
      listStyle: "none",
      padding: 0,
      marginTop: "20px",
    },
    sidebarLink: {
      padding: "12px 15px",
      margin: "10px 0",
      backgroundColor: "#f8f9fa",
      textDecoration: "none",
      color: "#333",
      fontWeight: "bold",
      borderRadius: "8px",
      display: "block",
      textAlign: "center",
      transition: "0.3s",
    },
    sidebarLinkHover: {
      backgroundColor: "#007BFF",
      color: "white",
    },
    contentHeader: {
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "15px",
      color: "#333",
    },
    contentText: {
      fontSize: "16px",
      color: "#666",
    },
    restaurantCard: {
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "15px",
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    restaurantName: {
      fontSize: "20px",
      fontWeight: "bold",
      color: "#007BFF",
    },
    restaurantLocation: {
      fontSize: "16px",
      color: "#555",
    },
    rating: {
      fontSize: "14px",
      color: "#888",
    },
    viewButton: {
      marginTop: "10px",
      padding: "8px 16px",
      backgroundColor: "#007BFF",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };

  const handleLogoClick = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleViewRestaurant = (id) => {
    if (userId) {
      navigate(`/restaurants/${id}?userId=${userId}&username=${username}`);
    } else {
      console.error("User ID not found");
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer} onClick={handleLogoClick}>
          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            style={styles.logo}
          />
          <div style={styles.logoText}>{isSidebarOpen && "MyApp"}</div>
        </div>
        <ul style={styles.sidebarLinks}>
          <li>
            <a href="#settings" style={styles.sidebarLink}>
              Settings
            </a>
          </li>
          <li>
            <a href="#feedback" style={styles.sidebarLink}>
              Feedback
            </a>
          </li>
          <li>
          <Link to={`/reservations/${userId}`} style={styles.sidebarLink}>
            Reservations
          </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Top Navigation */}
        <nav style={styles.navBar}>
          <div style={styles.navLinks}>
            <a href="#home" style={styles.navLink}>
              Home
            </a>
            <a href="#about" style={styles.navLink}>
              About Us
            </a>
            <a href="#contact" style={styles.navLink}>
              Contact Us
            </a>
            <a href="#reviews" style={styles.navLink}>
              Reviews
            </a>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </nav>

        {/* Page Content */}
        <div>
          <h1 style={styles.contentHeader}>
            Welcome, {username} (UserID: {userId})
          </h1>
          <p style={styles.contentText}>
            Explore restaurants, provide feedback, and manage reservations using
            the app.
          </p>

          {/* Restaurants List */}
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : (
            restaurants.map((restaurant) => (
              <div key={restaurant.restaurantID} style={styles.restaurantCard}>
                <div style={styles.restaurantName}>{restaurant.name}</div>
                <div style={styles.restaurantLocation}>
                  Location: {restaurant.location}
                </div>
                <div style={styles.rating}>
                  Average Rating: {restaurant.averageRating}
                </div>
                <button
                  style={styles.viewButton}
                  onClick={() => handleViewRestaurant(restaurant.restaurantID)}
                >
                  View Restaurant
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHomePage;
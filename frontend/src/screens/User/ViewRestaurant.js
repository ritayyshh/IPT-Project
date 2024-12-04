import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const ViewRestaurant = ({ handleLogout }) => {
  const { restaurantID, userId } = useParams();
  // const { restaurantID } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviews, setShowReviews] = useState(false);

  const [editingReview, setEditingReview] = useState(null); // Holds the review being edited
  const [editRating, setEditRating] = useState(""); // Rating for the popup form
  const [editComment, setEditComment] = useState(""); // Comment for the popup form
  const [isEditing, setIsEditing] = useState(false); 

  const navigate = useNavigate();
  const location = useLocation(); // To access the URL and query parameters

  // const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  // States for review form
  const [rating, setRating] = useState();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    // const userIdFromUrl = urlParams.get("userId");
    const usernameFromUrl = urlParams.get("username");
    // if (userIdFromUrl) setUserId(userIdFromUrl);
    if (usernameFromUrl) setUsername(usernameFromUrl);

    const fetchRestaurant = async () => {
      try {
        const response = await fetch(
          `http://localhost:5236/api/Restaurants/${restaurantID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch restaurant details");
        }
        const data = await response.json();
        setRestaurant(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantID, location.search]);

  const handleDeleteReview = async (reviewID) => {
    try {
      const response = await fetch(
        `http://localhost:5236/api/Reviews/${reviewID}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete the review");
      }

      // Remove the review from the list
      const updatedReviews = restaurant.reviews.filter(
        (review) => review.reviewID !== reviewID
      );

      // Recalculate average rating
      const newAverageRating =
        updatedReviews.length > 0
          ? updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
            updatedReviews.length
          : 0;

      // Update the restaurant state
      setRestaurant((prev) => ({
        ...prev,
        reviews: updatedReviews,
        averageRating: newAverageRating.toFixed(2), // Limit to 2 decimal places
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!rating || !comment) {
      alert("Please fill out all fields.");
      return;
    }

    const reviewData = {
      restaurantID: parseInt(restaurantID),
      userID: userId,
      rating: rating,
      comment: comment,
    };

    try {
      setIsSubmitting(true);
      const response = await fetch("http://localhost:5236/api/Reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the review.");
      }

      const newReview = await response.json();

      const updatedReviews = [...restaurant.reviews, newReview];

      const newAverageRating =
        updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
        updatedReviews.length;

      // Update the restaurant state
      setRestaurant((prev) => ({
        ...prev,
        reviews: updatedReviews,
        averageRating: newAverageRating.toFixed(2), // Limit to 2 decimal places
      }));

      // Reset the review form
      setRating(0);
      setComment("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = async () => {
    try {
      setIsEditing(true);
      const response = await fetch(
        `http://localhost:5236/api/Reviews/${editingReview.reviewID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating: parseFloat(editRating),
            comment: editComment,
          }),
        }
      );
  
      if (!response.ok) throw new Error("Failed to update review");
  
      // Handle empty response (e.g., 204 No Content)
      let updatedReview;
      if (response.status !== 204) {
        updatedReview = await response.json();
      } else {
        updatedReview = { ...editingReview, rating: parseFloat(editRating), comment: editComment };
      }
      
      // Update the specific review in the list
      const updatedReviews = restaurant.reviews.map((review) =>
        review.reviewID === editingReview.reviewID ? updatedReview : review
      );

      // Recalculate average rating
      const newAverageRating =
        updatedReviews.reduce((sum, review) => sum + review.rating, 0) /
        updatedReviews.length;

      // Update the restaurant state
      setRestaurant((prev) => ({
        ...prev,
        reviews: updatedReviews,
        averageRating: newAverageRating.toFixed(2), // Limit to 2 decimal places
      }));
      setEditingReview(null); // Close the edit popup
    } catch (err) {
      alert(err.message);
    } finally {
      setIsEditing(false);
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
    reserveButton: {
      position: "absolute", // Make it absolutely positioned
      top: "80px", // Add some spacing from the top of its container
      right: "10px", // Position it 10px away from the right edge
      padding: "10px 15px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
    },
    section: {
      marginBottom: "20px",
      padding: "15px",
      backgroundColor: "white",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
    review: {
      marginBottom: "10px",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "5px",
      backgroundColor: "#f9f9f9",
      position: "relative",
    },
    deleteButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      padding: "5px 10px",
      fontSize: "12px",
    },
    EditButton: {
      position: "absolute",
      top: "60px",
      right: "10px",
      backgroundColor: "green",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      padding: "5px 10px",
      fontSize: "12px",
    },
    addReviewForm: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#fff",
      border: "1px solid #ddd",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    // input: {
    //   padding: "10px",
    //   marginBottom: "15px",
    //   width: "100%",
    //   borderRadius: "5px",
    //   border: "1px solid #ddd",
    //   fontSize: "16px",
    // },
    button: {
      padding: "10px 15px",
      backgroundColor: "#28a745",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      width: "100%",
    },
    popup: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
      zIndex: 1001,
      maxWidth: '400px',
      width: '90%', // Responsive width
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
    label: {
      display: 'block',
      marginBottom: '1rem',
      fontSize: '1rem',
      fontWeight: '500',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginTop: '0.5rem',
    },
    textarea: {
      width: '100%',
      height: '100px',
      padding: '0.5rem',
      fontSize: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      marginTop: '0.5rem',
      resize: 'none',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '1.5rem',
    },
    saveButton: {
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    saveButtonHover: {
      backgroundColor: '#218838',
    },
    cancelButton: {
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    cancelButtonHover: {
      backgroundColor: '#c82333',
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

      
      <div style={styles.mainContent}>
        <h1 style={styles.header}>{restaurant.name}</h1>
        <button
          style={styles.reserveButton}
          onClick={() => navigate(`/ViewRestaurantTables/${restaurantID}/${userId}?username=${username}`)}
        >
          I want to Reserve
        </button>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionHeader}>Details</h2>
        <p style={styles.detailText}>Location: {restaurant.location}</p>
        <p style={styles.detailText}>Contact: {restaurant.contactNumber}</p>
        <p style={styles.detailText}>Description: {restaurant.description}</p>
        <p style={styles.detailText}>
          Average Rating: {restaurant.averageRating}
        </p>
      </div>

      <div style={styles.section}>
        <button
          style={styles.button}
          onClick={() => setShowReviews((prev) => !prev)}
        >
          {showReviews ? "Hide Reviews" : "View Reviews"}
        </button>

        {showReviews && restaurant.reviews.length > 0 && (
          <div>
            {restaurant.reviews.map((review) => (
              <div key={review.reviewID} style={styles.review}>
                <p><strong>{review.userName}</strong></p>
                <p>Date: {review.reviewDate}</p>
                <p>Rating: {review.rating}</p>
                <p>{review.comment}</p>
                {review.userName === username && (
                  <>
                  <button
                    style={styles.deleteButton}
                    onClick={() => handleDeleteReview(review.reviewID)}
                  >
                    Delete
                  </button>
                  <button
                  style={styles.EditButton}
                  onClick={() => {
                    setEditingReview(review);
                    setEditRating(review.rating.toString());
                    setEditComment(review.comment);
                  }}
                >
                  Edit
                </button>
                </>
                )}
              </div>
            ))}
            {editingReview && (
              <>
                <div style={styles.overlay} />
                <div style={styles.popup}>
                  <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Edit Review</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditReview();
                    }}
                  >
                    <label style={styles.label}>
                      Rating (1-5):
                      <input
                        type="number"
                        step="0.1" // Allows decimal input
                        value={editRating}
                        onChange={(e) => setEditRating(parseFloat(e.target.value) || 0)} // Parse as float, default to 0 if empty
                        min="1"
                        max="5"
                        required
                        style={styles.input}
                      />
                    </label>
                    <br />
                    <label style={styles.label}>
                      Comment:
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        required
                        style={styles.textarea}
                      />
                    </label>
                    <br />
                    <div style={styles.buttonContainer}>
                      <button type="submit" disabled={isEditing} style={styles.saveButton}>
                        {isEditing ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingReview(null)}
                        style={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        )}
        {showReviews && restaurant.reviews.length === 0 && (
          <p style={styles.detailText}>No reviews yet.</p>
        )}
      </div>

      <div style={styles.addReviewForm}>
        <h3>Add a Review</h3>
        <form onSubmit={handleAddReview}>
          <div>
            <label htmlFor="rating">Rating (1-5):</label>
            <input
              type="text"
              id="rating"
              placeholder="Enter a rating between 1 and 5"
              value={rating}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only valid numbers and empty string
                if (/^\d*\.?\d*$/.test(value)) {
                  setRating(value);
                }
              }}
              style={styles.input}
              required
            />
          </div>
          <div>
            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={styles.input}
              rows="4"
              required
            ></textarea>
          </div>
          <button type="submit" style={styles.button} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ViewRestaurant;
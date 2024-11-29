import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const ViewRestaurant = () => {
  const { restaurantID } = useParams();
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

  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  // States for review form
  const [rating, setRating] = useState();
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const userIdFromUrl = urlParams.get("userId");
    const usernameFromUrl = urlParams.get("username");
    if (userIdFromUrl) setUserId(userIdFromUrl);
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
      // Update the restaurant reviews after deletion
      setRestaurant((prev) => ({
        ...prev,
        reviews: prev.reviews.filter((review) => review.reviewID !== reviewID),
      }));
    } catch (err) {
      alert(err.message);
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

      const data = await response.json();
      // Append the new review to the restaurant state
      setRestaurant((prev) => ({
        ...prev,
        reviews: [...prev.reviews, data],
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
  
      setRestaurant((prev) => ({
        ...prev,
        reviews: prev.reviews.map((review) =>
          review.reviewID === editingReview.reviewID ? updatedReview : review
        ),
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
      position: "relative",
    },
    header: {
      fontSize: "24px",
      fontWeight: "bold",
      marginBottom: "20px",
      color: "#333",
    },
    reserveButton: {
      position: "absolute",
      top: 0,
      right: 0,
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
    input: {
      padding: "10px",
      marginBottom: "15px",
      width: "100%",
      borderRadius: "5px",
      border: "1px solid #ddd",
      fontSize: "16px",
    },
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
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "10px",
      zIndex: 1000,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
        <h1 style={styles.header}>{restaurant.name}</h1>
        <button
          style={styles.reserveButton}
          // onClick={() => navigate(`/ViewRestaurantTables/${restaurantID}`)}
          onClick={() => navigate(`/ViewRestaurantTables/${restaurantID}?username=${username}&userId=${userId}`)}
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
                <p>
                  <strong>{review.userName}</strong> ({review.reviewDate})
                </p>
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
                  <h2>Edit Review</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleEditReview();
                    }}
                  >
                    <label>
                      Rating (1-5):
                      <input
                        type="number"
                        step="0.1" // Allows decimal input
                        value={editRating}
                        onChange={(e) => setEditRating(parseFloat(e.target.value) || 0)} // Parse as float, default to 0 if empty
                        min="1"
                        max="5"
                        required
                      />

                    </label>
                    <br />
                    <label>
                      Comment:
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        required
                      />
                    </label>
                    <br />
                    <button type="submit" disabled={isEditing}>
                      {isEditing ? "Saving..." : "Save"}
                    </button>
                    <button type="button" onClick={() => setEditingReview(null)}>
                      Cancel
                    </button>
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
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ViewUserProfile = ({ handleLogout }) => {
  const { userId } = useParams(); // Get userId from URL
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5236/api/account/getUserDetails/${userId}`);
        setUserDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user details');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  // Handle password change
  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5236/api/account/changePasswordByUserId', {
        userID: userId,
        oldPassword,
        newPassword,
        confirmPassword,
      });
      alert('Password changed successfully');
      setIsModalOpen(false); // Close modal after success
    } catch (error) {
      alert('Error changing password');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <nav style={styles.navBar}>
        <div style={styles.navLinks}>
          <a href="#home"
            onClick={(e) => {
              e.preventDefault(); // Prevent the default anchor behavior
              navigate("/user-home"); // Navigate to the desired route
            }} 
            style={styles.navLink}>
            Home
          </a>
          <a href="#about" style={styles.navLink}>About Us</a>
          <a href="#contact" style={styles.navLink}>Contact Us</a>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </nav>

      {/* User Profile Card */}
      <div style={styles.cardContainer}>
        {userDetails && (
          <div style={styles.profileCard}>
            <h2 style={styles.cardTitle}>{userDetails.firstName} {userDetails.lastName}</h2>
            <p style={styles.cardText}><strong>Username:</strong> {userDetails.username}</p>
            <p style={styles.cardText}><strong>Email:</strong> {userDetails.email}</p>
            <button onClick={() => setIsModalOpen(true)} style={styles.changePasswordButton}>Change Password</button>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3 style={styles.modalTitle}>Change Password</h3>
            <label style={styles.modalLabel}>Old Password:</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={styles.modalInput}
            />
            <label style={styles.modalLabel}>New Password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={styles.modalInput}
            />
            <label style={styles.modalLabel}>Confirm New Password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.modalInput}
            />
            {passwordError && <p style={styles.errorText}>{passwordError}</p>}
            <div style={styles.modalButtons}>
              <button onClick={handlePasswordChange} style={styles.modalButton}>Change Password</button>
              <button onClick={() => setIsModalOpen(false)} style={styles.modalButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for UI components
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
  },
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#007BFF',
    padding: '10px 20px',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  logoutButton: {
    backgroundColor: '#ff4d4d',
    border: 'none',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    width: '350px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  cardText: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '10px',
  },
  changePasswordButton: {
    backgroundColor: '#007BFF',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '10px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  modalLabel: {
    fontSize: '14px',
    color: '#555',
    marginBottom: '5px',
    textAlign: 'left',
    display: 'block',
  },
  modalInput: {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  errorText: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '10px',
  },
  modalButtons: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#007BFF',
    border: 'none',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    width: '48%',
  },
};

export default ViewUserProfile;

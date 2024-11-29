import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';

import UserHomePage from './screens/User/UserHomePage';
import ViewRestaurant from "./screens/User/ViewRestaurant";
import ViewRestaurantTables from "./screens/User/ViewRestaurantTables";

import AdminHomePage from './screens/Admin/AdminHomePage';
import AdminViewRestaurant from './screens/Admin/AdminViewRestaurant';
import AdminAddRestaurant from './screens/Admin/AdminAddRestaurant';

function App() {
  const [token, setToken] = useState(null); // Stores token for authenticated user
  const [isAdmin, setIsAdmin] = useState(false); // Indicates if the user is an admin
  const [username, setUsername] = useState(''); // Stores username

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    setUsername('');
    localStorage.removeItem('authToken'); // Clear token from localStorage
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect to the appropriate page based on token and role */}
          <Route
            path="/"
            element={
              token ? (
                isAdmin ? (
                  <Navigate to="/admin-home" replace />
                ) : (
                  <Navigate to="/user-home" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* Login Page */}
          <Route
            path="/login"
            element={<LoginPage setToken={setToken} setIsAdmin={setIsAdmin} setUsername={setUsername} />}
          />
          {/* Registration Page */}
          <Route path="/register" element={<RegisterPage />} />
          {/* Admin Home Page */}
          <Route
            path="/admin-home"
            element={
              token && isAdmin ? (
                <AdminHomePage handleLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          {/* User Home Page */}
          <Route
            path="/user-home"
            element={
              token && !isAdmin ? (
                <UserHomePage handleLogout={handleLogout} username={username} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          {/* <Route path="/view-restaurant" element={<ViewRestaurant />} /> */}
          <Route path="/restaurants/:restaurantID" element={<ViewRestaurant />} />
          <Route path="/ViewRestaurantTables/:restaurantID" element={<ViewRestaurantTables />} />

          <Route path="/add-restaurant" element={<AdminAddRestaurant />} />
          {/* <Route path="/admin-view-restaurant" element={<AdminViewRestaurant />} /> */}
          <Route path="/adminrestaurants/:restaurantID" element={<AdminViewRestaurant />} />
          

        </Routes>
      </div>
    </Router>
  );
}

export default App;
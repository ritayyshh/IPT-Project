import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import LoginPage from './screens/LoginPage';
import RegisterPage from './screens/RegisterPage';

import UserHomePage from './screens/User/UserHomePage';
import ViewRestaurant from "./screens/User/ViewRestaurant";
import ViewRestaurantTables from "./screens/User/ViewRestaurantTables";
import ViewReservation from "./screens/User/ViewReservation";
import ViewUserProfile from "./screens/User/ViewUserProfile";

import AdminHomePage from './screens/Admin/AdminHomePage';
import AdminViewRestaurant from './screens/Admin/AdminViewRestaurant';
import AdminAddRestaurant from './screens/Admin/AdminAddRestaurant';

function App() {
  const [token, setToken] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogout = () => {
    setToken(null);
    setIsAdmin(false);
    setUsername('');
    localStorage.removeItem('authToken');
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={token ? (isAdmin ? ( <Navigate to="/admin-home" replace />
                                                      ) : ( <Navigate to="/user-home" replace /> )
                                                      ) : ( <Navigate to="/login" replace /> )} />

          <Route path="/login" element={<LoginPage setToken={setToken} setIsAdmin={setIsAdmin} setUsername={setUsername} /> } />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* User Pages */}
          <Route path="/user-home" element={ token && !isAdmin ? ( <UserHomePage handleLogout={handleLogout} username={username} />
                                                                 ) : ( <Navigate to="/login" replace /> )} />
          <Route path="/restaurants/:restaurantID/:userId" element={ token && !isAdmin ? ( <ViewRestaurant handleLogout={handleLogout} />
                                                                                 ) : ( <Navigate to="/login" replace /> )} />
          <Route path="/ViewRestaurantTables/:restaurantID/:userId" element={ token && !isAdmin ? ( <ViewRestaurantTables handleLogout={handleLogout} />
                                                                                          ) : ( <Navigate to="/login" replace /> )} />
          <Route path="/reservations/:userId" element={ token && !isAdmin ? ( <ViewReservation handleLogout={handleLogout} />
                                                                            ) : ( <Navigate to="/login" replace /> )} />
          <Route path="/userprofile/:userId" element={ token && !isAdmin ? ( <ViewUserProfile handleLogout={handleLogout} />
                                                                            ) : ( <Navigate to="/login" replace /> )} />

          {/* Admin Pages */}
          <Route path="/admin-home" element={token && isAdmin ? ( <AdminHomePage handleLogout={handleLogout} /> 
                                                                ) : ( <Navigate to="/login" replace /> )} />
          <Route path="/add-restaurant" element={token && isAdmin ? ( <AdminAddRestaurant handleLogout={handleLogout} />
                                                                    ) : ( <Navigate to="/login" replace /> )} />
          <Route path="/adminrestaurants/:restaurantID" element={token && isAdmin ? ( <AdminViewRestaurant handleLogout={handleLogout} />
                                                                    ) : ( <Navigate to="/login" replace /> )} />
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
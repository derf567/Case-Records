import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from "react-router-dom";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./Login";
import Register from "./Register";
//import HomePage from "./HomePage";  // Import the new HomePage component

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);  // Update user state based on authentication status
    });

    return () => unsubscribe();  // Clean up listener on unmount
  }, []);

  return (
    <Router>
      <div>
        <nav>
          {user ? (
            <Link to="/home">Home</Link>
          ) : (
            <></>
          )}
        </nav>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={user ? <HomePage /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

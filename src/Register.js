import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset any previous error messages
    setError("");

    // Create user with Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("User created successfully");
        navigate("/login"); // Redirect to login page after successful registration
      })
      .catch((error) => {
        setError(error.message); // Show any error message if registration fails
        console.error(error.message);
      });
  };

  return (
    <div>
      <h2>Create a New Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

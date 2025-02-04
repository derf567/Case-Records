import React, { useState } from "react";
import { loginUser } from "./authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";  // Import Link from react-router-dom
import "./Login.css";  // Add this import for custom styles

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(email, password);
      console.log("Logged in as:", user.email);
      navigate("/home");  // Redirect to home page on successful login
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="login-title">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="login-links">
          <p>
            {/* Use Link component for routing */}
            <Link to="/register">Create User Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState } from "react";
import { loginUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import React from 'react';
import './css/Login.css';
import logo_cr from './assets/Logo.png'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      console.log("Login attempt with:", { email, password });
      
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }
  
      const result = await loginUser(email, password);
      console.log("Login result:", result);
      
      if (result && result.isAdmin) {
        console.log("Admin login successful");
        navigate("/dashboard"); // or "/admin-dashboard" when ready
      } else {
        console.log("Regular user login successful");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      
      if (error.message.includes("admin credentials")) {
        setError("Invalid admin login. Please check your credentials.");
      } else if (error.code === 'auth/user-not-found') {
        setError("User not found. Please check your email.");
      } else if (error.code === 'auth/wrong-password') {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          <img src={logo_cr} alt="" />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="input">Email/Username
          <input 
            type="text" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter email or admin username"
          />
        </div>
        <div className="input">Password
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password"
          />
        </div>

        <div className="rf-container">
          <div className="remember">
            <input type="checkbox" />
            <label htmlFor="remember">Remember Me</label>
          </div>

          <div className="bottom-input">
            <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
          </div>
        </div>

        <Button
          label="Login"
          onClick={handleLogin}
          className="login-button"
        />

        <div>
          <a href="/register" className="register-link">Create a user account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
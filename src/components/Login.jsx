import { useState, useRef } from "react";
import { loginUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React from 'react';
import './css/Login.css';
import logo_cr from './assets/Logo.png';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);

  const showToast = (message, severity = "warn", summary = "Reminder") => {
    toast.current.show({ 
      severity, 
      summary, 
      detail: message, 
      life: 3000 
    });
  };

  const handleLogin = async () => {
    try {
      if (!email) {
        showToast("Please enter your email");
        return;
      }
      if (!password) {
        showToast("Please enter your password");
        return;
      }

      setLoading(true);
      const result = await loginUser(email, password);
      
      // Show success message
      showToast("Login successful! Redirecting to dashboard...", "success", "Success");
      
      // Add a small delay to show the success message before redirecting
      setTimeout(() => {
        if (result && result.isAdmin) {
          navigate("/caserecords");
        } else {
          navigate("/caserecords");
        }
      }, 1500);
      
    } catch (error) {
      setLoading(false);
      if (error.code === 'auth/user-not-found') {
        showToast("User not found. Please check your email.", "error", "Error");
      } else if (error.code === 'auth/wrong-password') {
        showToast("Incorrect password. Please try again.", "error", "Error");
      } else {
        showToast("Login failed. Please try again.", "error", "Error");
      }
    }
  };

  // Handle Enter key press for login
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <Toast ref={toast} position="top-center" />
      <div className="login-form">
        <div className="logo">
          <img src={logo_cr} alt="logo" />
        </div>
        <div className="input">Email/Username
          <input 
            type="text" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter email or admin username"
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="input">Password
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password"
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="rf-container">
          <div className="remember">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <div className="bottom-input">
            <a href="/ForgotPassword" className="forgot-password-link">Forgot Password?</a>
          </div>
        </div>
        <Button
          label={loading ? "Logging in..." : "Login"}
          onClick={handleLogin}
          className="login-button"
          disabled={loading}
          icon={loading ? "pi pi-spin pi-spinner" : ""}
        />
        <div>
          <a href="/Register" className="register-link">Create a user account</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
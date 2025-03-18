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
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useRef(null);

  const showReminder = (message, severity = "warn") => {
    toast.current.show({ severity, summary: "Reminder", detail: message, life: 3000 });
  };

  const handleLogin = async () => {
    try {
      if (!email) {
        showReminder("Please enter your email");
        return;
      }
      if (!password) {
        showReminder("Please enter your password");
        return;
      }

      const result = await loginUser(email, password);
      
      if (result && result.isAdmin) {
        navigate("/caserecords");
      } else {
        navigate("/caserecords");
      }
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        showReminder("User not found. Please check your email.", "error");
      } else if (error.code === 'auth/wrong-password') {
        showReminder("Incorrect password. Please try again.", "error");
      } else {
        showReminder("Login failed. Please try again.", "error");
      }
    }
  };

  return (
    <div className="login-container">
      <Toast ref={toast} />
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
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <div className="bottom-input">
            <a href="/ForgotPassword" className="forgot-password-link">Forgot Password?</a>
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

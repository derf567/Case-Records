import { useState } from "react";
import { loginUser } from "../services/authService";
import { useNavigate } from "react-router-dom";
import React from 'react'; 
import { Button } from 'primereact/button';
import './css/Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      console.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          label="Login"
          onClick={handleLogin}
          icon="pi pi-sign-in"
          className="custom-login-button"
        />
        <div className="forgot-password-links">
          <a href="/forgot-password" className="forgot-password-link">Forgot Password?</a>
        </div>
        <div className="register-links">
        <a href="/register" className="register-link">Dont have an account?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

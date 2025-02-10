import { useState } from "react";
import { loginUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import React from 'react'; 
import './css/login.css';
import logo_cr from './assets/Logo.png'

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

      <div className="logo">
        <img src={logo_cr} alt="" />
      </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="input">Email
        <input type="email" onChange={(e) => setEmail(e.target.value)}/></div>
        <div className="input">Password<input type="password" onChange={(e) => setPassword(e.target.value)}/></div>

        <div className="rf-container">
          <div className="remember">
            <input type="checkbox"/>
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

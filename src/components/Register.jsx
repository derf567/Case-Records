import { useState, useRef } from "react";
import { registerUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; // Import Toast component
import './css/Register.css';
import logo_cr from './assets/Logo.png';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useRef(null); // Create a reference for the Toast component
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Passwords do not match', life: 3000 });
      return;
    }

    try {
      await registerUser(email, password);
      navigate("/login");
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration successful', life: 3000 });
      navigate("/dashboard");
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: error.message, life: 3000 });
    }
  };

  return (
    <div className="register-container">
      <Toast ref={toast} /> {/* Add the Toast component here */}
      <div className="register-form">
        <div className="logo">
          <img src={logo_cr} alt="logo" />
        </div>
        <div className="input">Email<input type="email" onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="input">Password<input type="password" onChange={(e) => setPassword(e.target.value)} /></div>
        <div className="input">Confirm Password<input type="password" onChange={(e) => setConfirmPassword(e.target.value)} /></div>
        <Button label="Register" onClick={handleRegister} className="register-button" />
        <div>
          <a href="/" className="backto-login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
import { useState } from "react";
import { registerUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import './css/register.css';
import logo_cr from './assets/Logo.png'

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className = "register-container">
      <div className="register-form">
      <div className="logo">
        <img src={logo_cr} alt="" />
      </div>
        <div className = "input">Email<input type="email"  onChange={(e) => setEmail(e.target.value)} /></div>
        <div className = "input">Password<input type="password" onChange={(e) => setPassword(e.target.value)} /></div>
        <div className = "input">Confirm Password<input type="password"/></div>

      <Button
          label="Register"
          onClick={handleRegister}
          className="register-button"
        />

        <div>
          <a href="/" className="backto-login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;

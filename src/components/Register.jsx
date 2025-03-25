import { useState, useRef } from "react";
import { registerUser } from "../firebase/authService";
import { useNavigate } from "react-router-dom";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast'; // Import Toast component
import './css/Register.css';
import logo_cr from './assets/Logo.png';
import { Dialog } from 'primereact/dialog';

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useRef(null); // Create a reference for the Toast component
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const handleRegister = async () => {
    // Check if email is empty
    if (!email) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Email is required', life: 3000 });
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Passwords do not match', life: 3000 });
      return;
    }

    try {
      await registerUser(email, password);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Registration successful', life: 3000 });
      setVisible(true);      
      setTimeout(() => {navigate("/");}, 3000) // Redirect to login after successful registration
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
        <div className="input">
          Email
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input">
          Password
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="input">
          Confirm Password
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            required
          />
        </div>
        <Button label="Register" onClick={handleRegister} className="register-button" />
        <Dialog header="Success" 
          visible={visible} 
          style={{ width: '50vw' }} 
          onHide={() => setVisible(false)}>
                <p className="dialog-success">
                    Register Successfully!
                </p>
            </Dialog>
        <div>
          <a href="/" className="backto-login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
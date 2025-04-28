import { useState, useRef } from "react";
import { resetPassword } from "../firebase/authService";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import React from 'react';
import './css/ForgotPassword.css';
import logo_sq from './assets/LogoSquare.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useRef(null);

  const showToast = (message, severity = "warn", summary = "Reminder") => {
    toast.current.show({ 
      severity, 
      summary, 
      detail: message, 
      life: 3000 
    });
  };

  const handlePasswordReset = async () => {
    if (!email) {
      showToast("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email);
      showToast("Password reset email sent! Please check your inbox.", "success", "Success");
      setEmail(""); // Clear input after sending
    } catch (error) {
      console.error("Password reset error:", error);
      if (error.code === 'auth/user-not-found') {
        showToast("No account found with that email.", "error", "Error");
      } else if (error.code === 'auth/invalid-email') {
        showToast("Invalid email format. Please try again.", "error", "Error");
      } else {
        showToast("Something went wrong. Please try again.", "error", "Error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Allow pressing "Enter" to submit
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePasswordReset();
    }
  };

  return (
    <div>
      <Toast ref={toast} position="top-center" />


      <div className="fp-container">
        <div className="fp-form">
          <h1>FORGOT PASSWORD</h1>
          <div className="input">
            Email Address:
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              onKeyPress={handleKeyPress}
            />
          </div>

          <Button
            label={loading ? "Sending..." : "Submit"}
            onClick={handlePasswordReset}
            className="Submit-button"
            disabled={loading}
            icon={loading ? "pi pi-spin pi-spinner" : ""}
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

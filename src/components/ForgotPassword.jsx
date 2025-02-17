import React from 'react';
import { Button } from 'primereact/button';
import './css/ForgotPassword.css';

const ForgotPassword = () => {
  return (
    <div className = "fp-container">
      <div className="fp-form">
      <h1>FORGOT PASSWORD</h1>
        <div className = "input">Email Address:<input type="email" /></div>

      <Button
          label="Submit"
          className="Submit-button"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
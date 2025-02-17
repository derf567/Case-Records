import React from 'react';
import { Button } from 'primereact/button';
import './css/ResetPassword.css';

const ResetPassword = () => {
  return (
    <div className = "rp-container">
      <div className="rp-form">
      <h1>RESET PASSWORD</h1>
        <div className = "input">New Password<input type="password" /></div>
        <div className = "input">Confirm Password<input type="password" /></div>

      <Button
          label="Submit"
          className="Submit-button"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
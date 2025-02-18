import React from 'react';
import { Button } from 'primereact/button';
import './css/ResetPassword.css';
import logo_sq from './assets/LogoSquare.png'

const ResetPassword = () => {
  return (
    <div>
      <ul className="side">
        <div className="logo-sq"><img src={logo_sq} alt="logo" /></div>
      </ul>
      <div className="rp-container">
        <div className="rp-form">
          <h1>RESET PASSWORD</h1>
          <div className="input">New Password<input type="password" /></div>
          <div className="input">Confirm Password<input type="password" /></div>

          <Button
            label="Submit"
            className="Submit-button"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
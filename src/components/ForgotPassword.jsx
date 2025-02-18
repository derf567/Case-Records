import React from 'react';
import { Button } from 'primereact/button';
import './css/ForgotPassword.css';
import logo_sq from './assets/LogoSquare.png'

const ForgotPassword = () => {
  return (
    <div>
      <ul className="side">
          <div className="logo-sq"><img src={logo_sq} alt="logo" /></div>
      </ul>

      <div className="fp-container">
        <div className="fp-form">
          <h1>FORGOT PASSWORD</h1>
          <div className="input">Email Address:<input type="email" /></div>

          <Button
            label="Submit"
            className="Submit-button"
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
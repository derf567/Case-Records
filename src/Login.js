// Login.js
import { useState } from "react";
import { loginUser } from "./authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await loginUser(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error(error.message);
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div>
      <h2>Login</h2>
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
      <button onClick={handleLogin}>Login</button>
      
      {/* Add Register Button */}
      <p>Don't have an account?</p>
      <button onClick={navigateToRegister}>Register</button>
    </div>
  );
};

export default Login;

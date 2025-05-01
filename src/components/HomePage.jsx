import React from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log("User logged out");
      navigate("/");  // Redirect to login page after logout
    }).catch((error) => {
      console.error(error.message);
    });
  };

  return (
    <div>
      <h2>Welcome to the Home Page!</h2>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default HomePage;

// cd D:\React_codes\Case-Records-Github\Case-Records by Mamaril
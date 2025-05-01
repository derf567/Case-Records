// components/Login.jsx
"use client"

import { useState, useRef } from "react"
import { loginUser } from "../firebase/authService"
import { useNavigate } from "react-router-dom"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import { useAdmin } from "../firebase/AdminContext"
import "./css/Login.css"
import logo_cr from "./assets/Logo.png"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useRef(null)
  const { setIsAdmin } = useAdmin()

  const showToast = (message, severity = "warn", summary = "Reminder") => {
    toast.current.show({
      severity,
      summary,
      detail: message,
      life: 3000,
    })
  }

  const handleLogin = async () => {
    try {
      if (!email) {
        showToast("Please enter your email")
        return
      }
      if (!password) {
        showToast("Please enter your password")
        return
      }

      setLoading(true)
      const result = await loginUser(email, password)

      // Set admin status in context and session storage
      if (result && result.isAdmin) {
        console.log("Setting admin status to true")
        setIsAdmin(true)
        sessionStorage.setItem("isAdmin", "true")
        
        // Show success message
        showToast("Admin login successful! Redirecting...", "success", "Success")
        
        // Redirect immediately for admin
        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      } else {
        console.log("Setting admin status to false")
        setIsAdmin(false)
        sessionStorage.removeItem("isAdmin")
        
        // Show success message
        showToast("Login successful! Redirecting...", "success", "Success")
        
        // Redirect for regular user
        setTimeout(() => {
          navigate("/dashboard")
        }, 1500)
      }
    } catch (error) {
      console.error("Login error:", error)
      setLoading(false)
      
      if (error.code === "auth/user-not-found") {
        showToast("User not found. Please check your email.", "error", "Error")
      } else if (error.code === "auth/wrong-password") {
        showToast("Incorrect password. Please try again.", "error", "Error")
      } else if (error.code === "auth/user-not-approved") {
        showToast("Your account is pending approval by an administrator.", "error", "Account Pending")
      } else if (error.message === "Invalid admin credentials") {
        showToast("Invalid admin credentials. Please try again.", "error", "Error")
      } else {
        showToast(error.message || "Login failed. Please try again.", "error", "Error")
      }
    } finally {
      setLoading(false)
    }
  }

  // Handle Enter key press for login
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="login-container">
      <Toast ref={toast} position="top-center" />
      <div className="login-form">
        <div className="logo">
          <img src={logo_cr || "/placeholder.svg"} alt="logo" />
        </div>
        <div className="input">
          Email/Username
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email or admin username"
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="input">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            onKeyPress={handleKeyPress}
          />
        </div>
        <div className="rf-container">
          <div className="remember">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <div className="bottom-input">
            <a href="/forgotpassword" className="forgot-password-link">
              Forgot Password?
            </a>
          </div>
        </div>
        <Button
          label={loading ? "Logging in..." : "Login"}
          onClick={handleLogin}
          className="login-button"
          disabled={loading}
          icon={loading ? "pi pi-spin pi-spinner" : ""}
        />
        <div>
          <a href="/register" className="register-link">
            Create a user account
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
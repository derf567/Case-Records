"use client"

import { useState, useRef } from "react"
import { registerUser } from "../firebase/authService"
import { useNavigate } from "react-router-dom"
import { Button } from "primereact/button"
import { Toast } from "primereact/toast"
import "./css/Register.css"
import logo_cr from "./assets/Logo.png"
import { Dialog } from "primereact/dialog"

const Register = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const toast = useRef(null)
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const handleRegister = async () => {
    // Check if email is empty
    if (!email) {
      toast.current.show({ severity: "error", summary: "Error", detail: "Email is required", life: 3000 })
      return
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.current.show({ severity: "error", summary: "Error", detail: "Passwords do not match", life: 3000 })
      return
    }

    try {
      setLoading(true)
      await registerUser(email, password)

      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Registration successful. Your account is pending approval by an administrator.",
        life: 5000,
      })

      setVisible(true)

      // Redirect to login after a delay
      setTimeout(() => {
        navigate("/")
      }, 5000)
    } catch (error) {
      toast.current.show({ severity: "error", summary: "Error", detail: error.message, life: 3000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <Toast ref={toast} />
      <div className="register-form">
        <div className="logo">
          <img src={logo_cr || "/placeholder.svg"} alt="logo" />
        </div>
        <div className="input">
          Email
          <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
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
        <Button
          label={loading ? "Registering..." : "Register"}
          onClick={handleRegister}
          className="register-button"
          disabled={loading}
          icon={loading ? "pi pi-spin pi-spinner" : ""}
        />
        <Dialog
          header="Registration Successful"
          visible={visible}
          style={{ width: "50vw" }}
          onHide={() => setVisible(false)}
        >
          <p className="dialog-success">
            Your account has been created successfully! Your account is now pending approval by an administrator. You
            will be redirected to the login page.
          </p>
        </Dialog>
        <div>
          <a href="/" className="backto-login">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  )
}

export default Register

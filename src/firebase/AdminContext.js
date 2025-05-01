"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { auth, db } from "./firebase-config"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

const AdminContext = createContext(null)

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [userApproved, setUserApproved] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        // Check if user is admin (from session storage or other means)
        const adminStatus = sessionStorage.getItem("isAdmin") === "true"
        setIsAdmin(adminStatus)

        // If not admin, check approval status
        if (!adminStatus) {
          try {
            const userDoc = await getDoc(doc(db, "User", user.uid))
            if (userDoc.exists()) {
              const userData = userDoc.data()
              setUserApproved(userData.approved === true)
            } else {
              setUserApproved(false)
            }
          } catch (error) {
            console.error("Error checking user approval status:", error)
            setUserApproved(false)
          }
        }
      } else {
        setIsAdmin(false)
        setUserApproved(false)
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const setAdminStatus = (status) => {
    setIsAdmin(status)
    sessionStorage.setItem("isAdmin", status)
  }

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        setIsAdmin: setAdminStatus,
        currentUser,
        userApproved,
        isLoading,
      }}
    >
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)

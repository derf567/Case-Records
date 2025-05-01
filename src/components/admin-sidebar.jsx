"use client"
import { useNavigate } from "react-router-dom"
import { Button } from "primereact/button"
import { Avatar } from "primereact/avatar"

interface AdminSidebarProps {
  userName: string
  isSidebarCollapsed: boolean
  toggleSidebar: () => void
  onLogout: () => void
}

export const AdminSidebar = ({ userName, isSidebarCollapsed, toggleSidebar, onLogout }: AdminSidebarProps) => {
  const navigate = useNavigate()

  // Function to get user initials for avatar
  const getUserInitials = () => {
    if (!userName) return "A"

    const names = userName.split(" ")
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return userName.substring(0, 2).toUpperCase()
  }

  return (
    <div className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""}`}>
      {/* User Welcome Section with Toggle Button */}
      <div className="user-welcome">
        <Avatar
          label={getUserInitials()}
          shape="circle"
          className="user-avatar"
          style={{ backgroundColor: "#2196F3", color: "#ffffff" }}
        />

        {!isSidebarCollapsed && (
          <div className="welcome-text">
            <span>Welcome,</span>
            <h3>{userName}</h3>
          </div>
        )}

        <Button
          icon={isSidebarCollapsed ? "pi pi-bars" : "pi pi-times"}
          className="p-button-rounded p-button-text hamburger-button"
          onClick={toggleSidebar}
          aria-label="Toggle Menu"
        />
      </div>

      <div className="sidebar-divider"></div>

      <div className="sidebar-content">
        <Button
          label={isSidebarCollapsed ? "" : "Dashboard"}
          icon="pi pi-home"
          onClick={() => navigate("/dashboard")}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? "Dashboard" : undefined}
          tooltipOptions={isSidebarCollapsed ? { position: "right" } : undefined}
        />
        <Button
          label={isSidebarCollapsed ? "" : "Case Records"}
          icon="pi pi-folder"
          onClick={() => navigate("/caserecords")}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? "Case Records" : undefined}
          tooltipOptions={isSidebarCollapsed ? { position: "right" } : undefined}
        />
        <Button
          label={isSidebarCollapsed ? "" : "User Approvals"}
          icon="pi pi-users"
          onClick={() => navigate("/user-approvals")}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? "User Approvals" : undefined}
          tooltipOptions={isSidebarCollapsed ? { position: "right" } : undefined}
        />
        <Button
          label={isSidebarCollapsed ? "" : "Settings"}
          icon="pi pi-cog"
          onClick={() => navigate("/settings")}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? "Settings" : undefined}
          tooltipOptions={isSidebarCollapsed ? { position: "right" } : undefined}
        />
        <Button
          label={isSidebarCollapsed ? "" : "Resolved Cases"}
          icon="pi pi-check-square"
          onClick={() => navigate("/resolved-cases")}
          className="sidebar-button"
          tooltip={isSidebarCollapsed ? "Resolved Cases" : undefined}
          tooltipOptions={isSidebarCollapsed ? { position: "right" } : undefined}
        />
      </div>

      {/* Fixed position logout button */}
      <Button
        label={isSidebarCollapsed ? "" : "Logout"}
        icon="pi pi-sign-out"
        onClick={onLogout}
        className="sidebar-button logout-button"
        tooltip={isSidebarCollapsed ? "Logout" : undefined}
        tooltipOptions={isSidebarCollapsed ? { position: "right" } : undefined}
      />
    </div>
  )
}

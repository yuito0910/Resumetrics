import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Dashboard.css";

function APDashboardLayout() {
  const [showNotifications, setShowNotifications] = useState(false);

  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active-link" : "nav-link";

  const notifications = [
    { message: "Your application for Data Analyst was received", time: "30 m ago" },
    { message: "Software Engineer role moved to interview stage", time: "1 h ago" },
    { message: "New job posted: UX Designer", time: "2 h ago" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <img src="/logo.png" alt="Resumetrics Logo" className="logo-icon" />
            <h4 className="logo-text">Resumetrics</h4>
          </div>

          <nav>
            <ul>
              <li>
                <NavLink to="/ap-dashboard/account" className={linkClass}>
                  <i className="bi bi-person"></i> Account
                </NavLink>
              </li>
              <li>
                <NavLink to="/ap-dashboard/job-listings" className={linkClass}>
                  <i className="bi bi-briefcase"></i> Job Listings
                </NavLink>
              </li>
              <li>
                <NavLink to="/ap-dashboard/ap-dashboard-home" className={linkClass}>
                  <i className="bi bi-speedometer2"></i> Dashboard
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <hr />
          <nav>
            <ul>
              <li>
                <NavLink to="/ap/login" className={linkClass}>
                  <i className="bi bi-box-arrow-right"></i> Log out
                </NavLink>
              </li>
              <li>
                <NavLink to="/ap-dashboard/help" className={linkClass}>
                  <i className="bi bi-question-circle"></i> Help
                </NavLink>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="topbar-right">
            <div
              className="notification"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <i className="bi bi-bell"></i>
              <span className="dot"></span>
              {showNotifications && (
                <div className="notification-dropdown">
                  <ul>
                    {notifications.map((note, index) => (
                      <li key={index}>
                        <div className="note-message">{note.message}</div>
                        <div className="note-time">{note.time}</div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <span className="applicant-id">Applicant #001269</span>
            <div className="user-icon">
              <i className="bi bi-person-circle"></i>
            </div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default APDashboardLayout;

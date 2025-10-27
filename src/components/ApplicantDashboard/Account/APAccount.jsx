import React, { useState } from "react";
import "../Dashboard.css";

function APAccount() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    console.log("Updated applicant details:", form);
  };

  return (
    <div className="account-page">
      <h1 className="account-heading">Applicant Account</h1>
      <p className="account-subtext">Update your personal information below.</p>
      <hr />

      <div className="account-card">
        <form onSubmit={handleSubmit} className="account-form">
          <h3 className="section-title">Edit Account Info</h3>

          <div className="form-group">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="e.g. John"
              required
            />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="e.g. Doe"
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g. john.doe@example.com"
              required
            />
          </div>

          <h3 className="section-title">Change Password</h3>

          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter new password"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter new password"
            />
          </div>

          <button type="submit" className="btn-dark2">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default APAccount;

import React, { useState } from "react";
import "../HRDashboard.css";

function HRAccount() {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    phone: "",
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

    console.log("Updated account details:", form);
  };

  return (
    <div className="account-page">
      <h1 className="account-heading">Account Details</h1>
      <p className="account-subtext">Update your company and contact information below.</p>
      <hr />

      <form onSubmit={handleSubmit} className="account-form">
        <h3 className="section-title">General Information</h3>

        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            placeholder="e.g. Acme Corporation"
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
            placeholder="e.g. contact@acme.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="e.g. +63 912 345 6789"
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
  );
}

export default HRAccount;

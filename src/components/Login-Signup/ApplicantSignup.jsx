import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUpPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    birthdate: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        navigate("/ap/login"); // redirect to login on success
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={styles.logoSquare} />
          <h1 style={styles.title}>Sign Up to Resumetrics</h1>
          <p style={styles.subtitle}>Enter your details below to create your account</p>
        </div>

        {/* Inputs */}
        <div style={styles.grid}>
          <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} />
          <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} />
          <Input label="E-Mail" type="email" name="email" value={form.email} onChange={handleChange} />
          <div style={styles.inputGroup}>
            <label htmlFor="gender" style={styles.label}>Gender (optional)</label>
            <select id="gender" name="gender" value={form.gender} onChange={handleChange} style={styles.input}>
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Input label="Birthdate" type="date" name="birthdate" value={form.birthdate} onChange={handleChange} />
          <Input label="Phone Number" name="phone" value={form.phone} onChange={handleChange} />

          {/* Password */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
              <span onClick={() => setShowPassword((v) => !v)} style={styles.eyeIcon}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <div style={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                style={styles.input}
              />
              <span onClick={() => setShowConfirmPassword((v) => !v)} style={styles.eyeIcon}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        </div>

        {/* API Response */}
        {message && <p style={{ color: "red", textAlign: "center", marginTop: "1rem" }}>{message}</p>}

        {/* Buttons */}
        <div style={styles.buttons}>
          <button type="button" style={{ ...styles.button, ...styles.cancelButton }}>
            Cancel
          </button>
          <button type="submit" style={{ ...styles.button, ...styles.submitButton }}>
            Sign Up
          </button>
        </div>

        {/* Sign-in link */}
        <p style={styles.signIn}>
          Already have an account?{" "}
          <a href="/ap/login" style={styles.link}>Log in!</a>
        </p>
      </form>
    </div>
  );
}

// Reusable Input component
function Input({ label, type = "text", name, value, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} style={styles.input} />
    </div>
  );
}

// Styles
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#2B2D42",
    padding: "2rem",
  },
  card: {
    backgroundColor: "#fff",
    padding: "3rem",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "600px",
  },
  logoSquare: {
    width: "40px",
    height: "40px",
    backgroundColor: "#2B2D42",
    margin: "0 auto 1rem",
    borderRadius: "4px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#2B2D42",
    margin: 0,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#666",
    margin: "0.5rem 0 0",
  },
  grid: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "1fr 1fr",
    marginTop: "2rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gridColumn: "span 1",
  },
  label: {
    fontSize: "0.9em",
    marginBottom: "0.3rem",
    color: "#333",
  },
  input: {
    padding: "0.7rem 1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "1em",
    backgroundColor: "#F5F5F5",
    color: "#333",
    outline: "none",
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
  },
  eyeIcon: {
    position: "absolute",
    top: "50%",
    right: "0.75rem",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#888",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "2rem",
  },
  button: {
    flex: 1,
    minWidth: "150px",
    padding: "0.8rem 0",
    border: "none",
    borderRadius: "6px",
    fontSize: "1em",
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelButton: {
    background: "#eee",
    color: "#333",
  },
  submitButton: {
    background: "#2B2D42",
    color: "#fff",
  },
  signIn: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "0.9em",
    color: "#000",
  },
  link: {
    color: "#2B2D42",
    fontWeight: 600,
    textDecoration: "none",
  },
};

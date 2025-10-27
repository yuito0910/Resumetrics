import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const togglePassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        // ⭐ JWT IMPLEMENTATION STEP 1: Store the token
        if (data.token) {
          localStorage.setItem("authToken", data.token); // Store the JWT
          localStorage.setItem("userRole", data.user.role); // Optional: Store the role
          console.log("JWT Token Stored:", data.token);
        }
        
        console.log("Logged in user:", data.user);
        navigate("/ap-dashboard"); // redirect on success
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={styles.logoPlaceholder} />
        <h1 style={styles.title}>Log in to Resumetrics</h1>
        <p style={styles.subtitle}>Welcome back! Log in to continue.</p>

        {/* Email */}
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            E-Mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* Password */}
        <div style={styles.formGroup}>
          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <div style={styles.passwordWrapper}>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
            <span onClick={togglePassword} style={styles.eyeIcon}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* API message */}
        {message && <p style={{ color: "red", textAlign: "center" }}>{message}</p>}

        {/* Submit */}
        <button type="submit" style={styles.loginButton}>
          Log In
        </button>

        {/* Links */}
        <div style={styles.links}>
          <p>
            Don’t have an account?{" "}
            <a href="/ap/signup" style={styles.link}>
              Sign up
            </a>
          </p>
          <p>
            <a href="/forgot-password" style={styles.link}>
              Forgot Password?
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffffff", // Light background
    padding: "1rem",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: "5rem",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    color: "#333",
  },
  logoPlaceholder: {
    width: "60px",
    height: "60px",
    backgroundColor: "#2B2D42",
    margin: "0 auto 20px",
    borderRadius: "8px",
  },
  title: {
    marginBottom: "0.5rem",
    fontSize: "1.8rem",
    color: "#2B2D42",
  },
  subtitle: {
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    color: "#666",
  },
  formGroup: {
    marginBottom: "1.2rem",
    textAlign: "left",
  },
  label: {
    display: "block",
    marginBottom: "0.3rem",
    fontSize: "0.9em",
    color: "#333",
    fontWeight: 500,
  },
  input: {
    width: "95%",
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
  },
  eyeIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#888",
  },
  loginButton: {
    width: "104%",
    padding: "0.8rem",
    backgroundColor: "#2B2D42",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1em",
    cursor: "pointer",
    marginTop: "1rem",
  },
  links: {
    marginTop: "1.5rem",
    fontSize: "0.85rem",
    color: "#666",
  },
  link: {
    color: "#2B2D42",
    textDecoration: "none",
    fontWeight: 500,
  },
};

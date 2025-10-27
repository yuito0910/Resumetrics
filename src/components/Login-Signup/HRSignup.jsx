import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function HRSignUpPage() {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    contactNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
    logoFileName: "No file selected",
  });
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setLogoPreviewUrl(null);
      setForm((prev) => ({ ...prev, logoFileName: "No file selected" }));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreviewUrl(reader.result);
      setForm((prev) => ({ ...prev, logoFileName: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    // Only send the required fields to the API
    const apiForm = {
      companyName: form.companyName,
      email: form.email,
      contactNumber: form.contactNumber,
      address: form.address,
      password: form.password,
      confirmPassword: form.confirmPassword,
      // Note: Logo upload logic (which would involve sending the file data)
      // would typically be handled differently than JSON-only fields, 
      // but for this simplified component, we'll include the logo file name 
      // if it were part of the initial JSON payload structure.
      // Since we only need to include the *fields*, we'll proceed 
      // with the fields present in the state that are required.
      logoFileName: form.logoFileName, // Assuming the backend can handle the file upload separately or is mock.
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/hr/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiForm),
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok && data.success) {
        navigate("/hr/login"); // go to login/dashboard
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={styles.logoSquare} />
          <h1 style={styles.title}>Company Registration</h1>
          <p style={styles.subtitle}>
            Enter your details below to create your company account
          </p>
        </div>

        {/* Inputs Grid - Reduced to 1 column for simplicity as fewer inputs are needed, or 2 if design is kept */}
        <div style={styles.grid}> 
          <Input
            label="Company Name"
            name="companyName"
            value={form.companyName}
            onChange={handleChange}
            required
          />
          <Input
            label="Company Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <Input
            label="Company Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <Input
            label="Company Phone"
            name="contactNumber"
            value={form.contactNumber}
            onChange={handleChange}
            required
          />
          {/* Password */}
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            show={showPassword}
            toggle={() => setShowPassword((v) => !v)}
            onChange={handleChange}
            required
          />

          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            show={showConfirmPassword}
            toggle={() => setShowConfirmPassword((v) => !v)}
            onChange={handleChange}
            required
          />
          {/* Empty div to keep the grid structure if using a 2-column grid and there's an odd number of inputs */}
          {/* <div></div> */}
        </div>

        {/* Logo Upload */}
        <div style={{ margin: "1.5rem 0", textAlign: "center" }}>
          <p style={styles.uploadLabel}>Upload Company Logo</p>
          <label style={styles.logoBox}>
            {logoPreviewUrl ? (
              <img src={logoPreviewUrl} alt="Logo Preview" style={styles.logoImage} />
            ) : (
              <span style={styles.plusSign}>+</span>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              style={{ display: "none" }}
            />
          </label>
          <div style={styles.fileName}>{form.logoFileName}</div>
        </div>

        {/* API Response */}
        {message && <p style={{ textAlign: "center", marginTop: "0.5rem" }}>{message}</p>}

        {/* Buttons */}
        <div style={styles.buttons}>
          <button type="submit" style={{ ...styles.button, ...styles.submitButton }}>
            Sign Up
          </button>
        </div>

        {/* Sign in link */}
        <p style={styles.signIn}>
          Already have an account?{" "}
          <a href="/hr/login" style={styles.link}>
            Log in!
          </a>
        </p>
      </form>
    </div>
  );
}

// --- Small Reusable Components ---
function Input({ label, type = "text", name, value, onChange, required = false }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} style={styles.input} required={required} />
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, show, toggle, required = false }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <div style={styles.passwordWrapper}>
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          style={styles.input}
          required={required}
        />
        {show ? (
          <FaEyeSlash style={styles.eyeIcon} onClick={toggle} />
        ) : (
          <FaEye style={styles.eyeIcon} onClick={toggle} />
        )}
      </div>
    </div>
  );
}

// --- Styles ---
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "#2B2D42",
    padding: "40px",
  },
  card: {
    background: "#fff",
    padding: "10rem",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
    width: "900px",
 
  },
  logoSquare: {
    width: "40px",
    height: "40px",
    background: "#2B2D42",
    margin: "0 auto 1rem",
    borderRadius: "4px",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#000",
    margin: 0,
  },
  subtitle: {
    fontSize: "1rem",
    color: "#818181",
    margin: "0.5rem 0 0",
  },
  grid: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "1fr 1fr",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "0.9em",
    marginBottom: "0.3rem",
    color: "#000",
  },
  passwordWrapper: {
    position: "relative",
    width: "100%",
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
  eyeIcon: {
    position: "absolute",
    top: "50%",
    right: "0.75rem",
    transform: "translateY(-50%)",
    cursor: "pointer",
    color: "#888",
  },
  uploadLabel: {
    fontWeight: 600,
    marginBottom: "0.5rem",
    color: "#333",
  },
  logoBox: {
    width: "100px",
    height: "100px",
    border: "2px dashed #ccc",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "0 auto",
    cursor: "pointer",
  },
  plusSign: {
    fontSize: "1.5rem",
    color: "#000",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "8px",
  },
  fileName: {
    marginTop: "0.5rem",
    fontSize: "0.9em",
    color: "#555",
  },
  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "1.5rem",
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
    marginTop: "1rem",
    fontSize: "0.9em",
    color: "#000",
  },
  link: {
    color: "#2B2D42",
    fontWeight: 600,
    textDecoration: "none",
  },
};
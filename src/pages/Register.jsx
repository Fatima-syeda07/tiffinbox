import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    const result = await register(email, password, fullName, role);
    if (result.success) {
      // After registration, redirect to login with a success message
      navigate("/login", { state: { message: "Registration successful! Please login." } });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🍱</span>
          <h1>Join TiffinBox</h1>
          <p>Start your homemade meal journey</p>
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="hello@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 6 characters"
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>I want to join as:</label>
            <div className="role-selector">
              <label className={`role-option ${role === "customer" ? "active" : ""}`}>
                <input
                  type="radio"
                  value="customer"
                  checked={role === "customer"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>👤 Customer</span>
                <small>Browse & buy meal kits</small>
              </label>
              <label className={`role-option ${role === "cook" ? "active" : ""}`}>
                <input
                  type="radio"
                  value="cook"
                  checked={role === "cook"}
                  onChange={(e) => setRole(e.target.value)}
                />
                <span>👨‍🍳 Home Cook</span>
                <small>Sell your homemade meals</small>
              </label>
            </div>
          </div>
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import micLogo from '../assets/Mic_Logo.png';

export default function LoginPage() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('Teacher');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);

  const roles = ['Teacher', 'Student'];

  const handleSignIn = async (e) => {
    e.preventDefault();
    // Handle sign-in logic here
    console.log({
      role: selectedRole,
      email,
      password,
      rememberDevice,
    });

    // Navigate to appropriate dashboard based on role
    if (selectedRole === 'Teacher') {
      navigate('/teacherDashboard');
    } else if (selectedRole === 'Student') {
      navigate('/studentDashboard');
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo-box">
            <img src={micLogo} alt="Mic Logo" className="mic-logo" />
            <div className="red-dot"></div>
          </div>
        </div>

        {/* Header Section */}
        <div className="header-section">
          <p className="audio-engine-text">🎤 AUDIO ENGINE V3.4</p>
          <h1 className="main-title">EduRecord AI</h1>
          <p className="subtitle">Student Evaluation & Audio Assessment System</p>
        </div>

        {/* Role Selection */}
        <div className="role-selection-section">
          <label className="role-label">SELECT PORTAL ROLE</label>
          <div className="role-buttons-container">
            {roles.map((role) => (
              <button
                key={role}
                className={`role-button ${selectedRole === role ? 'active' : ''}`}
                onClick={() => setSelectedRole(role)}
              >
                {role === 'Teacher' && '👨‍🏫'}
                {role === 'Student' && '👤'}
                <span>{role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="info-box">
          <div className="info-icon">🛡️</div>
          <div className="info-text">
            <strong>Log in to record student audio evaluations</strong>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSignIn} className="login-form">
          {/* Email Field */}
          <div className="form-group">
            <label htmlFor="email">Email or Staff ID</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="email"
                placeholder=" johndoe@edu.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group">
            <div className="password-header">
              <label htmlFor="password">Password</label>
              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Remember Device */}
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={rememberDevice}
              onChange={(e) => setRememberDevice(e.target.checked)}
              className="checkbox-input"
            />
            <label htmlFor="remember" className="checkbox-label">
              Remember on this device
            </label>
          </div>

          {/* Sign In Button */}
          <button type="submit" className="sign-in-button">
            Sign In as {selectedRole} →
          </button>

          {/* Sign Up Link */}
          <div className="signup-section">
            <span className="signup-text">Don't have an account?</span>
            <button
              type="button"
              className="signup-button"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </div>
        </form>

        {/* Security Info */}
        <div className="security-info">
          <span className="security-icon">🔐</span>
          <span className="security-text">
            FERPA & STUDENT PRIVACY COMPLIANT • 256-BIT ENCRYPTION
          </span>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <a href="#">Help Center</a>
          <span className="separator">•</span>
          <a href="#">Audio Diagnostics</a>
          <span className="separator">•</span>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}

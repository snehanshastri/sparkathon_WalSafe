

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Check, Shield } from 'lucide-react';
import Header from '../components/Header';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  securityAnswer: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  securityAnswer?: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    securityAnswer: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const db = getFirestore();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.securityAnswer.trim()) {
      newErrors.securityAnswer = 'Security answer is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // Store security answer and name in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        securityAnswer: formData.securityAnswer.trim().toLowerCase()
      });

      navigate('/login');
    } catch (error: any) {
      alert(error.message || 'Failed to create account');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <div className="login-card">
          <div className="text-center">
            <h2>Create your account</h2>
            <p>Join WalSafe for great savings and convenience</p>
          </div>

          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                className="form-input"
                type="text"
                name="name"
                value={formData.name}
                placeholder="Enter your full name"
                onChange={handleInputChange}
              />
            </div>
            {errors.name && <p className="error">{errors.name}</p>}

            <label>Email Address</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                className="form-input"
                type="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleInputChange}
              />
            </div>
            {errors.email && <p className="error">{errors.email}</p>}

            <label>Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                className="form-input"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                placeholder="Create a password"
                onChange={handleInputChange}
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}

            <label>Confirm Password</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                className="form-input"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="Confirm your password"
                onChange={handleInputChange}
              />
              <span className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}

            <label>Security Answer (e.g., Your favorite color)</label>
            <div className="input-wrapper">
              <Shield size={18} className="input-icon" />
              <input
                className="form-input"
                type="text"
                name="securityAnswer"
                value={formData.securityAnswer}
                placeholder="Your security answer"
                onChange={handleInputChange}
              />
            </div>
            {errors.securityAnswer && <p className="error">{errors.securityAnswer}</p>}

            <button type="submit">
              <Check size={18} style={{ marginRight: '8px' }} />
              Create Account
            </button>

            <p className="signup-link">
              Already have an account? <Link to="/login">Sign in here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
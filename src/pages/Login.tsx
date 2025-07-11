
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import Header from '../components/Header';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

interface FormData {
  email: string;
  password: string;
}
interface FormErrors {
  email?: string;
  password?: string;
}
interface BehaviorData {
  keyTimings: { key: string; time: number }[];
  mouseMoves: { x: number; y: number; time: number }[];
  clicks: number[];
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [keyTimings, setKeyTimings] = useState<BehaviorData['keyTimings']>([]);
  const [mouseMoves, setMouseMoves] = useState<BehaviorData['mouseMoves']>([]);
  const [clicks, setClicks] = useState<BehaviorData['clicks']>([]);

  // 👀 Behavior tracking - key, mouse, clicks
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeyTimings(prev => [...prev, { key: e.key, time: Date.now() }]);
    };
    const handleMouseMove = (e: MouseEvent) => {
      setMouseMoves(prev => [...prev, { x: e.clientX, y: e.clientY, time: Date.now() }]);
    };
    const handleClick = () => {
      setClicks(prev => [...prev, Date.now()]);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, []);

  // ⏱ Continuous behavior data sending
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (
        keyTimings.length === 0 &&
        mouseMoves.length === 0 &&
        clicks.length === 0
      ) return;

      try {
        await axios.post('http://localhost:5000/api/track', {
          email: formData.email || 'anonymous',
          behaviorData: { keyTimings, mouseMoves, clicks },
          page: 'login',
          timestamp: Date.now(),
        });

        setKeyTimings([]);
        setMouseMoves([]);
        setClicks([]);
      } catch (err) {
        console.error('Failed to send behavior data:', err);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [keyTimings, mouseMoves, clicks, formData.email]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);

      const behaviorData: BehaviorData = { keyTimings, mouseMoves, clicks };

      await axios.post('http://localhost:5000/api/login', {
        email: formData.email,
        behaviorData,
      });

      navigate('/products');
    } catch (error) {
      alert('Login failed');
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
            <h2>Welcome back</h2>
            <p>Sign in to your WalSafe account</p>
          </div>

          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                onChange={handleInputChange}
              />
              <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}

            <div className="remember-forgot">
              <label>
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <a href="#">Forgot your password?</a>
            </div>

            <button type="submit">
              <LogIn size={18} style={{ marginRight: '8px' }} />
              Sign In
            </button>

            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign up now</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

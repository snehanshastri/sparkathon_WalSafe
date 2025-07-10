// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
// import Header from '../components/Header';

// interface FormData {
//   email: string;
//   password: string;
// }

// interface FormErrors {
//   email?: string;
//   password?: string;
// }

// const Login: React.FC = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FormData>({
//     email: '',
//     password: ''
//   });
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [showPassword, setShowPassword] = useState(false);

//   const validateForm = (): boolean => {
//     const newErrors: FormErrors = {};

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       // Simulate successful login
//       navigate('/products');
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     // Clear error when user starts typing
//     if (errors[name as keyof FormErrors]) {
//       setErrors(prev => ({ ...prev, [name]: undefined }));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
//             <p className="text-gray-600">Sign in to your WalSafe account</p>
//           </div>

//           <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                   Email Address
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent transition-colors ${
//                       errors.email ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your email"
//                   />
//                 </div>
//                 {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//               </div>

//               <div>
//                 <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                   Password
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="password"
//                     name="password"
//                     type={showPassword ? 'text' : 'password'}
//                     value={formData.password}
//                     onChange={handleInputChange}
//                     className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-walmart-blue focus:border-transparent transition-colors ${
//                       errors.password ? 'border-red-500' : 'border-gray-300'
//                     }`}
//                     placeholder="Enter your password"
//                   />
//                   <button
//                     type="button"
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
//               </div>
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <input
//                   id="remember-me"
//                   name="remember-me"
//                   type="checkbox"
//                   className="h-4 w-4 text-walmart-blue focus:ring-walmart-blue border-gray-300 rounded"
//                 />
//                 <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                   Remember me
//                 </label>
//               </div>
//               <div className="text-sm">
//                 <a href="#" className="font-medium text-walmart-blue hover:text-blue-700 transition-colors">
//                   Forgot your password?
//                 </a>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-walmart-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-walmart-blue transition-colors duration-200"
//             >
//               <LogIn className="h-5 w-5 mr-2" />
//               Sign In
//             </button>

//             <div className="text-center">
//               <p className="text-sm text-gray-600">
//                 Don't have an account?{' '}
//                 <Link to="/signup" className="font-medium text-walmart-blue hover:text-blue-700 transition-colors">
//                   Sign up now
//                 </Link>
//               </p>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import Header from '../components/Header';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/products');
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
              <input  className="form-input"
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
              <input  className="form-input"
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

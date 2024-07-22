import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ message: '', success: false });
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    const errors = {};

    if (!email) {
      errors.email = 'Email is required';
    }

    if (!gender) {
      errors.gender = 'Gender is required';
    }

    // Password validation
    const minLength = 8;
    const passwordRegex = {
      length: new RegExp(`^.{${minLength},}$`),
      uppercase: /[A-Z]/,
      lowercase: /[a-z]/,
      number: /\d/,
      special: /[@$!%*?&]/,
    };

    if (!password) {
      errors.password = 'Password is required';
    } else {
      if (!passwordRegex.length.test(password)) {
        errors.password = `Password must be at least ${minLength} characters long`;
      } else {
        if (!passwordRegex.uppercase.test(password)) {
          errors.password = 'Password must contain at least one uppercase letter';
        } else if (!passwordRegex.lowercase.test(password)) {
          errors.password = 'Password must contain at least one lowercase letter';
        } else if (!passwordRegex.number.test(password)) {
          errors.password = 'Password must contain at least one number';
        } else if (!passwordRegex.special.test(password)) {
          errors.password = 'Password must contain at least one special character';
        }
      }
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, gender }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData.message === 'Email already exists') {
          setError({ message: 'Email already exists', success: false });
        } else {
          setError({ message: errorData.message, success: false });
        }
        return;
      }
      // Registration successful logic
      setError({ message: 'Successfully registered', success: true });
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 3000);
    } catch (err) {
      console.error('Error:', err);
      setError({ message: 'An unexpected error occurred', success: false });
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="border border-red-400 rounded-md p-20 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error.message && (
          <div className={`mb-4 ${error.success ? 'text-green-500' : 'text-red-500'}`}>
            {error.message}
          </div>
        )}
        <form onSubmit={handleRegistrationSubmit}>
          <div className="mb-4 relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-10 py-2 pr-10 mt-1 border border-red-400 rounded-full focus:outline-none focus:border-red-300"
              autoComplete="email"
            />
            {fieldErrors.email && (
              <p className="absolute top-full left-0 mt-2 text-sm text-red-600">{fieldErrors.email}</p>
            )}
            <FaUser className="absolute top-11 transform -translate-y-1/2 right-4 text-gray-400" />
          </div>
          <div className="mb-4 relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-2 pr-10 mt-1 border border-red-400 rounded-full focus:outline-none focus:border-red-300"
              autoComplete="new-password"
            />
            {fieldErrors.password && (
              <p className="absolute top-full left-0 mt-2 text-sm text-red-600">{fieldErrors.password}</p>
            )}
            <button type="button" onClick={toggleShowPassword} className="absolute top-11 transform -translate-y-1/2 right-3 text-gray-400">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <div className="mb-4 relative">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender:
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              className="w-full px-10 py-2 pr-10 mt-1 border border-red-400 rounded-full focus:outline-none focus:border-red-300"
            >
              <option value="" disabled>Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {fieldErrors.gender && (
              <p className="absolute top-full left-0 mt-2 text-sm text-red-600">{fieldErrors.gender}</p>
            )}
          </div>
          <button
            type="submit"
            className="mt-5 w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-400 focus:outline-none focus:ring"
          >
            Register
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <button onClick={() => navigate('/')} className="text-red-500 hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;

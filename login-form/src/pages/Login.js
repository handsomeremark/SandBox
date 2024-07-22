import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { URL } from "../config/Config";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { TbLockSquareRoundedFilled } from "react-icons/tb";
import Typography from '@mui/material/Typography';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({ message: "", success: false });
  const [fieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          navigate("/admin-dashboard");
        } else {
          setError({ message: data.message, success: false });
        }
      } else {
        const text = await response.text(); // Get the HTML response
        console.error("Unexpected response format:", text);
        setError({ message: "Unexpected response format", success: false });
      }
    } catch (err) {
      console.error("Error:", err);
      setError({ message: "An unexpected error occurred", success: false });
    }
  };
  


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="border border-red-400 rounded-md p-20 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-15 relative">
      <div className="flex justify-center mb-4">
        <TbLockSquareRoundedFilled className="text-6xl text-red-500" />
      </div>
      <Typography component="h1" variant="h5" className="text-center">
        Login
      </Typography>
      {error.message && (
        <div className={`mb-4 ${error.success ? 'text-green-500' : 'text-red-500'}`}>
          {error.message}
        </div>
      )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              <FaUser className="absolute top-10 transform -translate-y-1/2 right-5 text-gray-400" />
              Email:
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-10 py-2 pl-10 border border-red-400 rounded-md focus:outline-none "
              autoComplete="email"
            />
          </div>
          <div className="mb-4 relative">
          <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password:
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-2 pr-10 mt-1 border border-red-400 rounded-md focus:outline-none focus:border-red-300"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center px-3 text-gray-600 mt-6"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash/>}
            </button>
            {fieldErrors.password && (
              <p className="absolute top-full left-0 mt-3 text-sm text-red-600">
                {fieldErrors.password}
              </p>
            )}
    
          </div>
          <div className="mb-4 text-right">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-black-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-400 focus:outline-none focus:ring"
          >
            Login
          </button>
        </form>
        <p className="mt-2 text-sm text-gray-600 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-red-500 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;

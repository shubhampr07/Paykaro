import React, { useEffect, useState } from "react";
import { Button } from "../component/Button";
import { BottomWarning } from "../component/BottomWarning";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/v1/user/signup",
        {
          username,
          firstName,
          lastName,
          password,
        }
      );
      localStorage.setItem("token", response.data.token);
      navigate("/set-pin");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email:</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-gray-700">First Name:</label>
            <input
              type="text"
              id="firstName"
              className="w-full px-3 py-2 border rounded-md"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-gray-700">Last Name:</label>
            <input
              type="text"
              id="lastName"
              className="w-full px-3 py-2 border rounded-md"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-700">Password:</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button onClick={handleSignup} label={"Sign up"} />
          {message && <div className="mt-4 text-center text-red-500">{message}</div>}
          <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"} />
        </form>
      </div>
    </div>
  );
};

export default Signup;

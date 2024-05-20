import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../component/Button";

const SetPin = () => {
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSetPin = async () => {
    if (pin !== confirmPin) {
      setMessage("PINs do not match");
      return;
    }
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/v1/user/set-pin",
        {
          pin,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Set PIN</h2>
        <div className="mb-4">
          <label htmlFor="pin" className="block text-gray-700">PIN:</label>
          <input
            type="password"
            id="pin"
            className="w-full px-3 py-2 border rounded-md"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPin" className="block text-gray-700">Confirm PIN:</label>
          <input
            type="password"
            id="confirmPin"
            className="w-full px-3 py-2 border rounded-md"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            required
          />
        </div>
        <Button onClick={handleSetPin} label={"Set PIN"} />
        {message && <div className="mt-4 text-center text-red-500">{message}</div>}
      </div>
    </div>
  );
};

export default SetPin;

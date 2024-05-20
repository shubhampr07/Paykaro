import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SendMoney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  const [pin, setPin] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("token");

    if (!userToken) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/v1/account/transfer",
        {
          to: id,
          amount,
          pin
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      setMessage(res.data.message);
      navigate("/paymentstatus?message=" + res?.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name && name.length > 0 && name[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Amount (in Rs)
                </label>
                <input
                  onChange={(e) => setAmount(Number(e.target.value))}
                  type="number"
                  id="amount"
                  placeholder="Enter Amount"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  PIN
                </label>
                <input
                  onChange={(e) => setPin(e.target.value)}
                  type="password"
                  id="pin"
                  placeholder="Enter PIN"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
              >
                Pay
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-red-500 text-white"
              >
                Cancel & Go Back
              </button>
              {message && <div className="mt-4 text-center">{message}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;

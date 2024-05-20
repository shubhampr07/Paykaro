import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { Button } from '../component/Button';
import { BottomWarning } from '../component/BottomWarning';


const Signin = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("token");
    
        if (userToken) {
          navigate("/dashboard");
        }
      }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form className="space-y-6">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          
          <div>
          <Button
              onClick={async () => {
                const response = await axios.post(
                  import.meta.env.VITE_SERVER_URL + "/api/v1/user/signin",
                  {
                    username,
                    password,
                  }
                );
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard");
              }}
              label={"Sign In"}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </form>
      </div>
    </div>
  )
}

export default Signin
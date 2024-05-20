import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const PaymentStatus = () => {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const message = searchParams.get("message");

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if(!userToken) {
      navigate("/signin");
    } else {
      const t = setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="bg-green-300 md:w-1/4 text-center py-10 px-5 m-4 text-green-900 font-bold text-3xl">
        {message}
        <div className="text-center text-black text-sm font-semibold py-4">
          Redirecting to Dashboard in 3 seconds.
        </div>
      </div>
    </div>
  )
}

export default PaymentStatus
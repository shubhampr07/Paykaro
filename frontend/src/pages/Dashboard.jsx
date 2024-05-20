import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Appbar from '../component/Appbar';
import Balance from '../component/Balance';
import Users from '../component/Users';

const Dashboard = () => {

    const [bal, setBal] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("token");
        if(!userToken) {
            navigate("/signin");
        }
        else {
            axios.get(import.meta.env.VITE_SERVER_URL + "/api/v1/account/balance", {
                headers: {
                    Authorization: "Bearer " + userToken,
                },
            }).then((response) => {
                setBal(response.data.balance);
            }).catch((error) => {
                navigate("/signin");
            });
        }
    }, [navigate]);

  return (
    <div>
        <Appbar />
        <div className="m-8">
            <Balance value={bal} />
            <Users />
        </div>
    </div>
  )
}

export default Dashboard
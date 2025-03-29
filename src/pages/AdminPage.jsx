import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () =>{
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try{
                const result = await axios.get("api/Admin/admin-test", {
                    withCredentials: true
                })
            }
            catch(e){
                navigate("/not-found")
            }
            
        }
        fetchData();
    }, [])
    return(
        <div>
            <p>
                Admin Page
            </p>
        </div>
    )

}

export default AdminPage;
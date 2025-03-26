import axios from "axios";
import React, { useEffect, useState } from "react";

const AdminPage = () =>{
    const [testMessage, setTestMessage] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get("api/Admin/admin-test", {
                withCredentials: true
            })
            setTestMessage(result.data);
        }
        fetchData();
        
    }, [])
    return(
        <div>
            <p>
                {testMessage}
            </p>
        </div>
    )

}

export default AdminPage;
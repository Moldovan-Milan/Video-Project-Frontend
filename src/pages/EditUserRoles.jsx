import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import loading from "../assets/loading.gif";

const EditUserRoles = () => {

  const {id} = useParams();
  const [safeId, setSafeId] = useState(id);
  const [user, setUser] = useState()
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async() => {
        try{
            const response = await axios.get(`api/user/${safeId}`)
            if(response.status === 200){
                const userData = response.data
                setUser(userData);
            }
        }
        catch(error){
            navigate("/not-found")
            console.error(error)
        }
    }
    fetchUser()
  }, [])

  return (
    <div>
        {user? (<div className='role-edit-container'>
            <h1>{user.userName}</h1>
        </div>):
            (<div>
                <img src={loading}/>
            </div>)
        }
        
    </div>
  )
}

export default EditUserRoles
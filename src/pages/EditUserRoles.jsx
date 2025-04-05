import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import loading from "../assets/loading.gif";

const EditUserRoles = () => {

  const {id} = useParams();
  const [safeId, setSafeId] = useState(id);
  const [user, setUser] = useState()
  const navigate = useNavigate();
  const [roles, setRoles] = useState([])
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUser = async() => {
        try{
            const response = await axios.get(`api/user/${safeId}`)
            if(response.status === 200){
                const userData = response.data
                setUser(userData);
            }
            const rolesResponse = await axios.get(`api/user/get-roles/${safeId}`, {withCredentials: true})
            console.log(rolesResponse)
            if(response.status === 200){
                setRoles(rolesResponse.data.roles)
            }
        }
        catch(error){
            console.error(error)
            navigate("/not-found")
        }
    }
    fetchUser()
  }, [])

  return (
    <div>
        {user? (<div className='role-edit-container'>
            <img src={`${BASE_URL}/api/User/avatar/${user.avatarId}`}/>
            <p>username: {user.userName}</p>
            <p>ID: {user.id}</p>
            <ul>
                {roles.map((role, index) => (
                    <li key={index}>{role}</li>
                ))}
            </ul>
        </div>):
            (<div>
                <img src={loading}/>
            </div>)
        }
        
    </div>
  )
}

export default EditUserRoles
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import UserEditComponent from '../components/UserEditComponent';
import axios from 'axios';

const EditUser = () => {
  const { id } = useParams();
  const [safeId] = useState(id)
  const [pageNumber, setPageNumber] = useState(1);
  const [userVideos,setUserVideos]=useState([]);
  const pageSize = 30;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
    followers: 0,
    created: "",
  });
  useEffect(() => {
    const fetchUser = async () => {
        try {
          const { data } = await axios.get(`/api/user/profile/${safeId}?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
            withCredentials: true
          });
          const formattedDate = new Date(data.user.created).toLocaleDateString(
            "hu-HU",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          );
          console.log(data)
          setUserData({
            id: safeId,
            username: data.user.userName,
            email: data.user.email,
            avatar: `${BASE_URL}/api/User/avatar/${data.user.avatarId}`,
            followers: data.user.followersCount,
            created: formattedDate
          });
          
          setUserVideos(data.user.videos)
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
    };
    fetchUser();
  }, []);
  return (
    <UserEditComponent userData={userData} userVideos={userVideos}/>
  )
}

export default EditUser
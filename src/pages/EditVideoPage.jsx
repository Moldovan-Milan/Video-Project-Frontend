import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../components/contexts/UserProvider";

const EditVideoPage = () => {
  const [videoData, setVideoData] = useState({});
  const id = useParams().id;
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");

        const videoPromise = axios.get(`/api/video/data/${id}`);

        const [videoResponse] = await Promise.all([videoPromise]);

        setVideoData(videoResponse.data);

        if(!user){
          navigate("/login")
        }
        else if(user.id !== videoData.userId){
          navigate(`/video/${id}`)
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <h1>{videoData.title}</h1>
      <p>{videoData.description}</p>
      {/* Add more properties as needed */}
    </div>
  );
};

export default EditVideoPage;

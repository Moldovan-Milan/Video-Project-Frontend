import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EditVideoPage = () => {
  // Id alapján lekérni a videó adatait
  const [videoData, setVideoData] = useState({});
  const id = useParams().id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("jwtToken");

        const videoPromise = axios.get(`/api/video/data/${id}`);

        const [videoResponse] = await Promise.all([videoPromise]);

        setVideoData(videoResponse.data);
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

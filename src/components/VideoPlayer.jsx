import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import axios from "axios";

const VideoPlayer = ({ src, id }) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(`api/video/data/${id}`);
        setData(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { title, thumbnailId, created, user } = data;

  return (
    <div>
      <h2>{title}</h2>
      <ReactPlayer
        style={{ width: "500px", height: "500px" }}
        controls={true}
        url={src}
        pip={true}
        stopOnUnmount={false}
        light={`https://localhost:7124/api/video/thumbnail/${thumbnailId}`}
      />
      <p>Feltöltve: {created}</p>
      <p>Felhasználó: {user.userName}</p>
      <p>A felhasználó követőinek száma: {user.followers}</p>
    </div>
  );
};

export default VideoPlayer;

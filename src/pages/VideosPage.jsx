import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import VideoItem from "../components/VideoItem";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { jwtDecode } from "jwt-decode";

const fetchVideos = async () => {
  const { data } = await axios.get("api/video");
  console.log("Fetched videos:", data);
  return data;
};

const VideosPage = () => {
  const { data, error, isLoading } = useQuery(["videos"], fetchVideos);
  const [username, setUsername] = useState(null);

  const handleLogout = async () => {
    try {
      await axios.post(
        "api/user/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      localStorage.removeItem("jwtToken"); // Token törlése a localStorage-ból
      setUsername(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  useEffect(() => {
    let token = localStorage.getItem("jwtToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setUsername(decodedToken.sub);
    }
  }, [username]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <div className="row">
      <Header handleLogout={handleLogout} username={username} />
      <Link className="text-center btn btn-primary" to="/video/upload">
        Videó feltöltése
      </Link>
      <h1 className="text-center">Videók</h1>
      {data.map((video, id) => (
        <VideoItem key={id} video={video} />
      ))}
    </div>
  );
};

export default VideosPage;

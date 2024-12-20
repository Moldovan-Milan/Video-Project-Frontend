import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import VideoItem from "../components/VideoItem";
import { Link } from "react-router-dom";

const fetchVideos = async () => {
  const { data } = await axios.get("api/video");
  console.log("Fetched videos:", data);
  return data;
};

const VideosPage = () => {
  const { data, error, isLoading } = useQuery(["videos"], fetchVideos);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log(data);

  return (
    <div className="row">
      <h1 className="text-center">Videók</h1>
      {data.map((video, id) => (
        <VideoItem key={id} video={video} />
      ))}
    </div>
  );
};

export default VideosPage;

import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import VideoItem from "../components/VideoItem";
import { Link } from "react-router-dom";

const VideosPage = (search) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await axios.get("api/video");
      setData(data);
    };
    document.title = "Omega Stream"
    fetchVideos();
  }, []);

  if (search) {
    const [filteredVideos, setFilteredVideos] = useState([]);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center -mx-2">
        {data && data.map((video, id) => <VideoItem key={id} video={video} />)}
      </div>
    </div>
  );
};

export default VideosPage;

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
      console.log(data);
      setData(data);
    };

    fetchVideos();
  }, []);

  if (search) {
    const [filteredVideos, setFilteredVideos] = useState([]);
  }

  //if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-4">Videók</h1>
      <div className="flex flex-wrap justify-center -mx-2">
        {data && data.map((video, id) => <VideoItem key={id} video={video} />)}
      </div>
    </div>
  );
};

export default VideosPage;

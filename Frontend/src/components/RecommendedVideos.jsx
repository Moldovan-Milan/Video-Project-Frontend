import React, { useState, useEffect } from "react";
import axios from "axios";
import "./RecVideoItem"
import RecVideoItem from "./RecVideoItem";

export default function RecommendedVideos()
{
    const [data, setData] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await axios.get("api/video");
      setData(data);
    };

    fetchVideos();
  }, []);


  return(
    <div>
        {data && data.map((video, id) => <RecVideoItem key={id} video={video} />)}
    </div>
  )
}
import React, { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import { useParams } from "react-router-dom";
import axios from "axios";
import timeAgo from "../functions/timeAgo";
import "./SingleVideo.scss";
import { FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";

const SingleVideo = () => {
  const { id } = useParams();
  const [videoData, setVideoData] = useState({
    video: null,
    user: null,
    userAvatar: null,
    title: "",
    created: "",
    likes: 0,
    dislikes: 0,
  });

  useEffect(() => {
    const fetchVideo = async () => {
      const { data } = await axios.get(`/api/video/data/${id}`);
      setVideoData({
        video: data,
        user: data.user.userName,
        userAvatar: `https://localhost:7124/api/User/avatar/${data.user.avatarId}`,
        title: data.title,
        created: data.created,
        likes: data.likes,
        dislikes: data.dislikes,
      });
    };
    fetchVideo();
  }, [id]);

  return (
    <div className="container">
      <VideoPlayer src={`https://localhost:7124/api/video/${id}`} id={id} className={"vplayer"}/>
      <div className="video-info">
        <div className="video-title">{videoData.title}</div>
        <div className="video-user">
          <img
            src={videoData.userAvatar}
            alt="User Avatar"
            className="avatar"
          />
          <h5 className="username">{videoData.user}</h5>
        </div>
        <div className="video-details">
          <div className="video-views">
            <FaEye className="eye-icon"/>10 views ● Created: {timeAgo(new Date(videoData.created))}
          </div>
          <div className="video-likes">
            <button className="likes" id="like-button">
              <FaThumbsUp className="symbol"/>
              {videoData.likes} 
            </button>
            <button className="likes" id="dislike-button">
              <FaThumbsDown className="symbol"/>
              {videoData.dislikes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleVideo;

import React, { useEffect, useState } from "react";
import VideoPlayer from "../components/VideoPlayer";
import { useParams } from "react-router-dom";
import axios from "axios";
import timeAgo from "../functions/timeAgo";
import isTokenExpired from "../functions/isTokenExpired";
import "./SingleVideo.scss";
import { FaEye, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import CommentSection from "../components/CommentSection";

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
    comments: []
  });
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [likeValue, setLikeValue] = useState("none");
  const [token, setToken] = useState(null);

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
      comments: data.comments
    });
  };

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token || isTokenExpired(token)) {
        return;
      }
      setIsUserLoggedIn(true);
      setToken(token);
    };

    const getUserLikeValue = async () => {
      if (!isUserLoggedIn) {
        return;
      }
      const { data } = await axios.get(`/api/video/is-liked-by-user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLikeValue(data.result);
    };

    const initialize = async () => {
      await fetchVideo();
      await checkToken();
      await getUserLikeValue();
    };

    initialize();
  }, [id, isUserLoggedIn, token]);

  const handleLikeClick = () => {
    if (isUserLoggedIn) {
      const newLikeValue = likeValue === "like" ? "none" : "like";
      setLikeValue(newLikeValue);
      postUserLikeValueChange(newLikeValue);
    }
  };

  const handleDislikeClick = () => {
    if (isUserLoggedIn) {
      const newDislikeValue = likeValue === "dislike" ? "none" : "dislike";
      setLikeValue(newDislikeValue);
      postUserLikeValueChange(newDislikeValue);
    }
  };

  const postUserLikeValueChange = async (value) => {
    if (!value) return;
    const formData = new FormData();
    formData.append("value", value);
    const { data } = await axios.post(
      `/api/video/set-user-like/${id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log(data);
    fetchVideo();
  };

  return (
    <div className="container">
      <VideoPlayer
        src={`https://localhost:7124/api/video/${id}`}
        id={id}
        className={"vplayer"}
      />
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
            <FaEye className="eye-icon" />
            10 views ● Created: {timeAgo(new Date(videoData.created))}
          </div>
          <div className="video-likes">
            <button className="likes" id="like-button">
              <FaThumbsUp
                style={likeValue === "like" && { color: "rgb(26, 165, 26)" }}
                onClick={handleLikeClick}
                className="symbol"
              />
              {videoData.likes}
            </button>
            <button className="likes" id="dislike-button">
              <FaThumbsDown
                style={likeValue === "dislike" && { color: "red" }}
                onClick={handleDislikeClick}
                className="symbol"
              />
              {videoData.dislikes}
            </button>
          </div>
        </div>
      </div>
      <div>
        <CommentSection comments={videoData.comments}></CommentSection>
      </div>
    </div>
  );
};

export default SingleVideo;

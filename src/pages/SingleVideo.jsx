import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "../components/VideoPlayer";
import timeAgo from "../functions/timeAgo";
import {
  FaEye,
  FaThumbsDown,
  FaThumbsUp,
  FaUserPlus,
  FaUserMinus,
  FaPencilAlt,
} from "react-icons/fa";
import { UserContext } from "../components/contexts/UserProvider";
import "../styles/SingleVideo.scss";
import CommentSection from "../components/CommentSection";
import RecommendedVideos from "../components/RecommendedVideos";
import getViewText from "../functions/getViewText";

const SingleVideo = () => {
  const { id } = useParams();
  const [safeId] = useState(id)
  const { user } = useContext(UserContext);

  const [videoData, setVideoData] = useState(null);
  const [likeValue, setLikeValue] = useState("none");
  const [isFollowedByUser, setIsFollowedByUser] = useState(false);

  const [comments, setComments] = useState([]);
  const [bottomPanel, setBottomPanel] = useState("Comments");

  const [recomendedVideos, setRecomendedVideos] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {

        const videoPromise = axios.get(`/api/video/data/${safeId}`);
        const userInteractionPromise =
          user
            ? axios.get(`/api/video/get-user-like-subscribe-value/${safeId}`, {
                withCredentials: true
              })
            : null;
        const recomendedVideoPromise = axios.get("/api/video");

        const [
          videoResponse,
          userInteractionResponse,
          recomendedVideoResponse,
        ] = await Promise.all([
          videoPromise,
          userInteractionPromise,
          recomendedVideoPromise,
        ]);

        setVideoData(videoResponse.data);
        setComments(videoResponse.data.comments);
        setRecomendedVideos(recomendedVideoResponse.data.videos);

        if (userInteractionResponse) {
          setIsFollowedByUser(userInteractionResponse.data.subscribeResult);
          setLikeValue(userInteractionResponse.data.likeResult);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if(videoData){
      document.title = videoData.title + " | Omega Stream"
    }
  }, [videoData])

  const handleReactionClick = async (newValue) => {

    let updatedLikes = videoData.likes;
    let updatedDislikes = videoData.dislikes;

    if (likeValue === newValue) {
      // Ha ugyanarra a gombra kattint, akkor visszavonja
      newValue = "none";
      if (likeValue === "like") updatedLikes--;
      if (likeValue === "dislike") updatedDislikes--;
    } else {
      // Ha másik gombot nyom meg, akkor az ellentétét visszavonja és az új értéket beállítja
      if (likeValue === "like") updatedLikes--;
      if (likeValue === "dislike") updatedDislikes--;
      if (newValue === "like") updatedLikes++;
      if (newValue === "dislike") updatedDislikes++;
    }

    setLikeValue(newValue);
    setVideoData({
      ...videoData,
      likes: updatedLikes,
      dislikes: updatedDislikes,
    });

    try {
      const formData = new FormData();
      formData.append("value", newValue);
      await axios.post(`/api/video/set-user-like/${safeId}`, formData, {
        withCredentials: true
      });
    } catch (error) {
      console.error("Error updating like value:", error);
    }
  };

  const handleSubscribeClick = async () => {
    try {
      const formData = new FormData();
      formData.append("value", !isFollowedByUser);
      const { status } = await axios.post(
        `/api/video/change-subscribe/${videoData.userId}`,
        formData,
        { withCredentials: true }
      );
      if (status === 200) {
        setIsFollowedByUser(!isFollowedByUser);
        isFollowedByUser === false
          ? videoData.user.followersCount++
          : videoData.user.followersCount--;
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  if (!videoData) return <div>Loading...</div>;

  return (
    <div className="container">
      <VideoPlayer
        src={`${BASE_URL}/api/video/${id}`}
        id={id}
        className="vplayer"
      />

      <div className="video-info">
        <h2 className="video-title">{videoData.title}</h2>
        <Link to={`/profile/${videoData.userId}`} className="video-user">
          <img
            src={`${BASE_URL}/api/User/avatar/${videoData.user.avatarId}`}
            alt="User Avatar"
            className="avatar"
          />
          <h5 className="username">{videoData.user.userName}</h5>
        </Link>
        
        {user && user.id === videoData.user.id && (
          <Link to={`/video/${id}/edit`}>
            <button className="editBtn">
              Edit Video <FaPencilAlt className="m-2" />
            </button>
          </Link>
        )}

        {user && user.id === videoData.user.id && (
          <div className="subCountLabel m-2">
            <FaUserPlus className="m-1"/><p>Subscribers: {videoData.user.followersCount}</p>
          </div>
        )}

        {!(user && user.id === videoData.user.id) && (
          <button className="lil-sub-btn m-2" onClick={handleSubscribeClick}>
            {isFollowedByUser ? "Subscribed ✅" : "Subscribe"}{" "}
            {isFollowedByUser ? <span></span> : <FaUserPlus className="m-1" />}
            <span>{videoData.user.followersCount}</span>
          </button>
        )}
        

        <div className="video-details">
          <div className="video-views">
            <FaEye className="eye-icon" /> {getViewText(videoData.views)} ● Created:{" "}
            {timeAgo(new Date(videoData.created))}
          </div>
          <div className="video-likes">
            <button
              className="likes"
              id="like-button"
              onClick={() => handleReactionClick("like")}
            >
              <FaThumbsUp
                style={
                  likeValue === "like" ? { color: "rgb(26, 165, 26)" } : {}
                }
                className="symbol"
              />
              {videoData.likes}
            </button>
            <button
              className="likes"
              id="dislike-button"
              onClick={() => handleReactionClick("dislike")}
            >
              <FaThumbsDown
                style={likeValue === "dislike" ? { color: "red" } : {}}
                className="symbol"
              />
              {videoData.dislikes}
            </button>
          </div>
        </div>
      </div>
      <div className="divBottomPanelSwitch">
        <button
          className={
            bottomPanel === "Comments"
              ? "btnBottomPanelActive"
              : "btnSwitchBottomPanel"
          }
          onClick={() => setBottomPanel("Comments")}
        >
          Comments
        </button>
        <button
          className={
            bottomPanel === "Recommended"
              ? "btnBottomPanelActive"
              : "btnSwitchBottomPanel"
          }
          onClick={() => setBottomPanel("Recommended")}
        >
          Recommended videos
        </button>
      </div>
      <div>
        {bottomPanel === "Comments" ? (
          <CommentSection
            comments={comments}
            videoId={id}
            setComments={setComments}
          />
        ) : (
          <RecommendedVideos data={recomendedVideos} />
        )}
      </div>
    </div>
  );
};

export default SingleVideo;

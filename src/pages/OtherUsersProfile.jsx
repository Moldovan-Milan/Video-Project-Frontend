import axios from "axios";
import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import "../styles/OtherUsersProfile.scss";
import { FaMailBulk, FaUserPlus, FaPencilAlt } from "react-icons/fa";
import UserPageVideoItem from "../components/UserPageVideoItem";
import { UserContext } from "../components/contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import loadingImg from "../assets/loading.gif";

const OtherUsersProfile = () => {
  //TODO: pagination
  const { id } = useParams();
  const [safeId] = useState(id)
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {user} = useContext(UserContext)
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 30;
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
        try {
            const { data } = await axios.get(`/api/user/profile/${safeId}`);
            setUserData({
                id: data.user.id,
                username: data.user.userName,
                avatarId: data.user.avatarId,
                followers: data.user.followersCount,
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setLoading(false);
        }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchVideos = async () => {
        try {
            const response = await axios.get(`/api/user/profile/${safeId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
            const { hasMore } = response.data;
            const newVideos = response.data.user.videos;

            setVideos((prevVideos) => {
              const filteredNewVideos = newVideos.filter(
                  (newVideo) => !prevVideos.some((video) => video.id === newVideo.id)
              );
              return [...prevVideos, ...filteredNewVideos];
          });
            setHasMore(hasMore);
        } catch (error) {
            console.error("Error fetching videos:", error);
        }
    };

    fetchVideos();
  }, [pageNumber]);


  const lastVideoRef = useCallback(
          (node) => {
              console.log("Observer ref active!")
              if (!hasMore) return;
              if (observerRef.current) observerRef.current.disconnect();
              observerRef.current = new IntersectionObserver((entries) => {
                  if (entries[0].isIntersecting) {
                      setPageNumber((prevPageNumber) => prevPageNumber + 1);
                  }
              });
              if (node) observerRef.current.observe(node);
          },
          [hasMore]
      );

  useEffect(() => {
    if (userData) {
      document.title = `Profile of ${userData.username} | Omega Stream`;
    }
  }, [userData]);

  //TODO: new chat if it doesn't exist
  const handleMessageSend = () => {

  }

  const handleSubscribeClick = async () => {
    try {
      const formData = new FormData();
      formData.append("value", !isSubscribed);
      const { status } = await axios.post(
        `/api/video/change-subscribe/${userData.id}`,
        formData,
        { withCredentials: true }
      );
      if (status === 200) {
        setIsSubscribed(!isSubscribed);
        userData.followers += isSubscribed ? -1 : 1;
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  if (loading || !userData) return <img src={loadingImg} alt="loading"/>;

  return (
    <>
      <div>
        <table className="user-properties-table">
          <tbody>
            <tr>
              <td rowSpan={2}>
                <img
                  className="avatar-picture"
                  src={`${BASE_URL}/api/User/avatar/${userData.avatarId}`}
                  alt={userData.username}
                />
              </td>
              <td colSpan={2}>
                <h1 className="user-username text-center">
                  {userData.username}
                </h1>
              </td>
            </tr>
            {!(user && user.id === userData.id) ? (
              <tr>
                <td>
                  <button className="send-message-btn text-white font-bold py-2 px-4 rounded mb-2 navbar-btn m-1" onClick={handleMessageSend}>
                    Send Message
                    <FaMailBulk className="m-1" />
                  </button>
                </td>
                <td>
                  {!isSubscribed ? (
                    <button
                      onClick={handleSubscribeClick}
                      className="subscribe-btn font-bold py-2 px-4 rounded mb-2 navbar-btn m-1"
                    >
                      Subscribe | {userData.followers}
                      <FaUserPlus className="m-1" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribeClick}
                      className="subscribe-btn font-bold py-2 px-4 rounded mb-2 navbar-btn m-1"
                    >
                      Subscribed | {userData.followers}
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              <tr>
                <td>
                  <button className="editVideosBtn">
                    <FaPencilAlt className="m-1"/><p>Edit Your Videos</p>
                  </button>
                </td>
                <td>
                  <div className="subscribersLabel">
                    <FaUserPlus className="m-1"/><p>Your subscribers: {userData.followers}</p>
                  </div>
                </td>
              </tr>
            )}
              
          </tbody>
        </table>
      </div>

      <div className="container mx-auto p-4">
        <div className="flex flex-wrap justify-center -mx-2">
          {videos.map((video, id) => {
            const isLastVideo = id === videos.length - 1;
            return(<UserPageVideoItem key={id} video={video} ref={isLastVideo ? lastVideoRef : null} />);
          })}
        </div>
      </div>
    </>
  );
};

export default OtherUsersProfile;

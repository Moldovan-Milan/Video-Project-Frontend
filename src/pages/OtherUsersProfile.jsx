import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/OtherUsersProfile.scss";
import { FaMailBulk, FaUserPlus, FaPencilAlt } from "react-icons/fa";
import UserPageVideoItem from "../components/UserPageVideoItem";
import isTokenExpired from "../functions/isTokenExpired";
import { UserContext } from "../components/contexts/UserProvider";

//TODO: check if this page belongs to the user who is logged in
const OtherUsersProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState(null);  // Initialize as null instead of undefined
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const {user} = useContext(UserContext)

  useEffect(() => {
    setToken(sessionStorage.getItem("jwtToken"));
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/profile/${id}`);
        setUserData({
          id: data.id,
          username: data.userName,
          avatarId: data.avatarId,
          followers: data.followersCount,
        });
        setVideos(data.videos);
        setLoading(false);

        // Check if there's a token and fetch subscription status
        if (token) {
          const subscriptionStatus = await axios.get(
            `api/video/is-user-subscribed/${data.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setIsSubscribed(subscriptionStatus.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, token]);  // Dependency array includes id and token to re-fetch if these change

  // Handle document title update
  useEffect(() => {
    if (userData) {
      document.title = `Profile of ${userData.username} | Omega Stream`;
    }
  }, [userData]);  // Runs when userData is updated

  const handleSubscribeClick = async () => {
    if (!token || isTokenExpired(token)) return;
    try {
      const formData = new FormData();
      formData.append("value", !isSubscribed);
      const { status } = await axios.post(
        `/api/video/change-subscribe/${userData.id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (status === 200) {
        setIsSubscribed(!isSubscribed);
        userData.followers += isSubscribed ? -1 : 1;  // Adjust follower count
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  if (loading || !userData) return <div>Loading...</div>;  // Show loading state until data is available

  return (
    <>
      <div>
        <table className="user-properties-table">
          <tbody>
            <tr>
              <td rowSpan={2}>
                <img
                  className="avatar-picture"
                  src={`https://localhost:7124/api/User/avatar/${userData.avatarId}`}
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
                  <button className="send-message-btn text-white font-bold py-2 px-4 rounded mb-2 navbar-btn m-1">
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
          {videos.map((video, id) => (
            <UserPageVideoItem key={id} video={video} />
          ))}
        </div>
      </div>
    </>
  );
};

export default OtherUsersProfile;

import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/OtherUsersProfile.scss";
import { FaMailBulk, FaUserPlus } from "react-icons/fa";
import UserPageVideoItem from "../components/UserPageVideoItem";
import isTokenExpired from "../functions/isTokenExpired";
import { UserContext } from "../components/contexts/UserProvider";

const OtherUsersProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [isSubscribed, setisSubscribed] = useState(false);

  useEffect(() => {
    setToken(sessionStorage.getItem("jwtToken"));
    const fetchUser = async () => {
      const { data } = await axios.get(`/api/user/profile/${id}`);
      setUserData({
        id: data.id,
        username: data.userName,
        avatarId: data.avatarId,
        followers: data.followersCount,
      });
      setVideos(data.videos);
      setLoading(false);

      token
        ? setisSubscribed(
            (
              await axios.get(`api/video/is-user-subscribed/${userData.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            ).data
          )
        : null;
    };
    fetchUser();
    console.log(isSubscribed);
  }, [id]);

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
        setisSubscribed(!isSubscribed);
        isSubscribed === false ? userData.followers++ : userData.followers--;
      }
    } catch (error) {
      console.error("Error subscribing:", error);
    }
  };

  if (loading) return <div>Loading ...</div>;

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
                />
              </td>
              <td colSpan={2}>
                <h1 className="user-username text-center">
                  {userData.username}
                </h1>
              </td>
            </tr>
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
          </tbody>
        </table>
      </div>

      <div className="container mx-auto p-4">
        <div className="flex flex-wrap justify-center -mx-2">
          {videos &&
            videos.map((video, id) => (
              <UserPageVideoItem key={id} video={video} />
            ))}
        </div>
      </div>
    </>
  );
};

export default OtherUsersProfile;

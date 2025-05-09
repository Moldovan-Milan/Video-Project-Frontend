import axios from "axios";
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import "../styles/UserProfile/OtherUsersProfile.scss";
import { FaMailBulk, FaUserPlus, FaPencilAlt } from "react-icons/fa";
import UserPageVideoItem from "../components/UserProfile/UserPageVideoItem";
import { UserContext } from "../components/contexts/UserProvider";
import { useNavigate, Link } from "react-router-dom";
import loadingImg from "../assets/loading.gif";
import isColorDark from "../functions/isColorDark";
import getRoles from "../functions/getRoles";
import OtherUsersProfileHeader from "../components/UserProfile/OtherUsersProfileHeader";

const OtherUsersProfile = () => {
  //TODO: pagination
  const { id } = useParams();
  const [safeId] = useState(id);
  const [userData, setUserData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 30;
  const observerRef = useRef(null);
  const [primaryColor, setPrimaryColor] = useState(null);
  const [secondaryColor, setSecondaryColor] = useState(null);

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const loadRoles = async () => {
      const fetchedRoles = await getRoles(user.id);
      setRoles(fetchedRoles);
    };

    const getSubscibeValue = async () => {
      const { data } = await axios.get(`api/video/is-user-subscribed/${id}`, {
        withCredentials: true,
      });
      setIsSubscribed(data);
    };

    if (user) {
      loadRoles();
      getSubscibeValue();
    }
  }, [user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`/api/user/profile/${safeId}`);
        setUserData({
          id: data.user.id,
          username: data.user.userName,
          followers: data.user.followersCount,
          userTheme: data.user.userTheme,
          avatar: data.user.avatar,
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
        const response = await axios.get(
          `/api/user/profile/${safeId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
        );
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
      console.log("Observer ref active!");
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

  const handleMessageSend = async () => {
    if (user) {
      try {
        const formData = new FormData();
        formData.append("userId", userData.id);
        const response = await axios.post(
          `${BASE_URL}/api/chat/new-chat`,
          formData,
          { withCredentials: true }
        );

        if (response.status === 200) {
          navigate(`/chat/${response.data}`);
        } else if (response.status === 404) {
          console.log("User not foud");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

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

  if (loading || !userData) return <img src={loadingImg} alt="loading" />;

  return (
    <div
      style={
        userData.userTheme && userData.userTheme.background
          ? {
              background: userData.userTheme.background,
              color: isColorDark(userData.userTheme.background)
                ? "white"
                : "black",
              height: "100%",
              borderRadius: "20px",
            }
          : null
      }
    >
      <div>
        <OtherUsersProfileHeader userData={userData} />
        <table className="user-properties-table">
          <tbody>
            {!(user && user.id === userData.id) ? (
              <tr>
                <td>
                  <button
                    className="send-message-btn font-bold py-2 px-4 rounded mb-2 navbar-btn m-1"
                    onClick={handleMessageSend}
                    style={
                      userData.userTheme && userData.userTheme.secondaryColor
                        ? {
                            backgroundColor: userData.userTheme.secondaryColor,
                            color: isColorDark(
                              userData.userTheme.secondaryColor
                            )
                              ? "white"
                              : "black",
                          }
                        : null
                    }
                  >
                    Send Message
                    <FaMailBulk className="m-1" />
                  </button>
                </td>
                <td>
                  {!isSubscribed ? (
                    <button
                      onClick={handleSubscribeClick}
                      className="subscribe-btn font-bold py-2 px-4 rounded mb-2 navbar-btn m-1"
                      style={
                        userData.userTheme && userData.userTheme.primaryColor
                          ? {
                              backgroundColor: userData.userTheme.primaryColor,
                              color: isColorDark(
                                userData.userTheme.primaryColor
                              )
                                ? "white"
                                : "black",
                            }
                          : null
                      }
                    >
                      Subscribe | {userData.followers}
                      <FaUserPlus className="m-1" />
                    </button>
                  ) : (
                    <button
                      onClick={handleSubscribeClick}
                      className="subscribe-btn font-bold py-2 px-4 rounded mb-2 navbar-btn m-1"
                      style={
                        userData.userTheme && userData.userTheme.primaryColor
                          ? {
                              backgroundColor: userData.userTheme.primaryColor,
                              color: isColorDark(
                                userData.userTheme.primaryColor
                              )
                                ? "white"
                                : "black",
                            }
                          : null
                      }
                    >
                      Subscribed | {userData.followers}
                    </button>
                  )}
                </td>
                {user && roles.includes("Admin") && user.id !== userData.id && (
                  <td>
                    <Link to={`/profile/${userData.id}/edit`}>
                      <button className="editUser font-bold py-2 px-4 rounded mb-2 navbar-btn m-1">
                        <FaPencilAlt className="m-1" /> Edit this user's profile
                      </button>
                    </Link>
                  </td>
                )}
              </tr>
            ) : (
              <tr>
                <td>
                  <Link to={"/profile"}>
                    <button
                      className="editVideosBtn"
                      style={
                        userData.userTheme && userData.userTheme.secondaryColor
                          ? {
                              backgroundColor:
                                userData.userTheme.secondaryColor,
                            }
                          : null
                      }
                    >
                      <FaPencilAlt className="m-1" />
                      <p>Edit Your Profile</p>
                    </button>
                  </Link>
                </td>
                <td>
                  <div
                    className="subscribersLabel"
                    style={
                      userData.userTheme && userData.userTheme.primaryColor
                        ? { backgroundColor: userData.userTheme.primaryColor }
                        : null
                    }
                  >
                    <FaUserPlus className="m-1" />
                    <p>Your subscribers: {userData.followers}</p>
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
            return (
              <UserPageVideoItem
                key={id}
                video={video}
                color={
                  userData.userTheme && userData.userTheme.secondaryColor
                    ? userData.userTheme.secondaryColor
                    : null
                }
                ref={isLastVideo ? lastVideoRef : null}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OtherUsersProfile;

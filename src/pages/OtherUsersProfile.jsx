import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./OtherUsersProfile.scss"
import { FaMailBulk, FaUserPlus } from "react-icons/fa";
import UserPageVideoItem from "../components/UserPageVideoItem";

const OtherUsersProfile = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await axios.get(`/api/user/profile/${id}`);
      console.log(data);
      setUserData({
        id: data.id,
        username: data.userName,
        avatarId: data.avatarId,
        followers: data.followers,
      });
      setVideos(data.videos);
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  if (loading) return <div>Loading ...</div>;

  return (
    <>
      <div>
        <table className="user-properties-table">
          <tbody>
            <tr>
              <td rowSpan={2}>
              <img className="avatar-picture"
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
                <button className="send-message-btn text-white font-bold py-2 px-4 rounded mb-2 navbar-btn m-1">Send Message<FaMailBulk className="m-1"/></button>
                
              </td>
              <td>
                <button className="subscribe-btn font-bold py-2 px-4 rounded mb-2 navbar-btn m-1">Subscribe<FaUserPlus className="m-1"/></button>
              </td>
            </tr>
          </tbody>
        </table>

        
      </div>
      
      
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap justify-center -mx-2">
          {videos &&
            videos.map((video, id) => <UserPageVideoItem key={id} video={video} />)}
        </div>
      </div>
    </>
  );
};

export default OtherUsersProfile;

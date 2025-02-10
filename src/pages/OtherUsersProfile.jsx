import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import VideoItem from "../components/VideoItem";

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
      <h1 className="text-center text-lg text-lime-400">
        {userData.username} profile
      </h1>
      <p className="text-center text-lime-600 m-5">Send message</p>
      <img
        src={`https://localhost:7124/api/User/avatar/${userData.avatarId}`}
      />
      <div className="container mx-auto p-4">
        <div className="flex flex-wrap justify-center -mx-2">
          {videos &&
            videos.map((video, id) => <VideoItem key={id} video={video} />)}
        </div>
      </div>
    </>
  );
};

export default OtherUsersProfile;

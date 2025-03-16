import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LiveStreamList.scss";
import { Link } from "react-router-dom";

const LiveStreamList = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [liveStreams, setLiveStreams] = useState([]);

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        const { data } = await axios.get("api/LiveStream/");
        setLiveStreams(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchStreams();
  }, []);

  return (
    <div className="live-streams">
      <h1 className="title">Live Streams</h1>

      {liveStreams.length > 0 ? (
        <div className="stream-grid">
          {liveStreams.map((ls, index) => (
            <Link to={`/livestream/${ls.id}`} key={index}>
              <div className="stream-card">
                <img
                  src={`${BASE_URL}/api/user/avatar/${ls.user.avatarId}`}
                  alt={`${ls.user.userName}'s avatar`}
                  className="avatar"
                />
                <h2 className="stream-title">{ls.title}</h2>
                <p className="username">{ls.user.userName}</p>
                <p className="description">{ls.description}</p>
                <p className="started-at">
                  Started at: {new Date(ls.startedAt).toLocaleString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-streams">No live streams available.</p>
      )}
    </div>
  );
};

export default LiveStreamList;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/LiveStreamList.scss";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";

const LiveStreamList = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [liveStreams, setLiveStreams] = useState([]);
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;

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
                <h2 className="stream-title">{ls.streamTitle}</h2>
                <p className="username">By: {ls.user.userName}</p>
                <p className="description">{ls.description}</p>
                <p className="flex flex-row">
                  Viewers: {ls.viewers} <FaEye className="m-1"/>
                </p>
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

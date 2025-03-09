import React, { useContext, useEffect, useRef, useState } from "react";
import { useWTSignalR } from "../components/contexts/WatchTogetherSingalRProvider";
import { useNavigate, useParams } from "react-router-dom";
import WatchTogetherVideoPlayer from "../components/WatchTogetherVideoPlayer";
import { UserContext } from "../components/contexts/UserProvider";
import ChatPanel from "../components/ChatPanel";
import "../output.css";
import "../index.css";
import "../styles/WatchTogetherRoom.scss";
import { FaSearch } from "react-icons/fa";
import WatchTogetherVideoItem from "../components/WatchTogetherVideoItem.jsx";
import axios from "axios";

const WatchTogetherRoom = () => {
  const navigate = useNavigate();
  const connection = useWTSignalR();
  const { id } = useParams();
  const { user } = useContext(UserContext);

  // Host data
  const [isHost, setIsHost] = useState(false);
  const [isHostLeft, setIsHostLeft] = useState(false);

  // Room and user data
  const [isInRoom, setIsInRoom] = useState(false);
  const [users, setUsers] = useState([]);
  const [userRequest, setUserRequest] = useState([]);
  const [messages, setMessages] = useState([]);
  const [playList, setPlayList] = useState([]); // Playlist state
  const [videos, setVideos] = useState([]);

  // Video data
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // UI data
  const [showUsers, setShowUsers] = useState(false);
  const searchRef = useRef();

  const acceptUser = (userId) => {
    connection.invoke("AcceptUser", id, userId);
    setUserRequest((prev) => prev.filter((u) => u.id !== userId));
  };

  const rejectUser = (userId) => {
    connection.invoke("RejectUser", id, userId);
    setUserRequest((prev) => prev.filter((u) => u.id !== userId));
  };

  const sendMessage = (content) => {
    if (!content) {
      alert("You can not send an empty message");
      return;
    }
    connection.invoke("SendMessage", id, user.id, content);
  };

  const banUser = (userId) => {
    if (isHost) {
      connection.invoke("BanUser", id, userId);
    }
  };

  const handleSearch = async () => {
    const searchString = searchRef.current.value;
    if (!searchString) {
      return;
    }
    const { data } = await axios.get(`/api/video/search/${searchString}`);
    console.log(data);
    setVideos(data);
  };

  const onVideoSelect = (video) => {
    console.log("Selected a video!!!!");
    console.log(video);
    setPlayList((prev) => [...prev, video]);
  };

  useEffect(() => {
    if (connection && connection.state === "Connected" && user) {
      connection.on("JoinedToRoom", setUsers);
      connection.on("RequestAccepted", (time, isPlaying, messages) => {
        setIsInRoom(true);
        setTime(time);
        setIsPlaying(isPlaying);
        if (messages) {
          setMessages(messages);
        }
      });
      connection.on("RequestRejected", () => {
        alert("Your request to join the room was rejected.");
        navigate("/watch-together");
      });
      connection.on("LeavedRoom", setUsers);
      connection.on("HostLeftRoom", () => setIsHostLeft(true));
      connection.on("HostInRoom", () => setIsHostLeft(false));
      connection.on("YouAreHost", (messages) => {
        setIsHost(true);
        setIsInRoom(true);
        if (messages) {
          setMessages(messages);
        }
      });
      connection.on("JoinRequest", (u) =>
        setUserRequest((prev) => [...prev, u])
      );
      connection.on("ReceiveMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      connection.on("YouAreBanned", () => {
        alert("You are banned by host");
        navigate("/watch-together");
      });

      connection.invoke("JoinRoom", id, user.id).catch(console.error);

      return () => {
        connection.off("JoinedToRoom");
        connection.off("RequestAccepted");
        connection.off("RequestRejected");
        connection.off("LeavedRoom");
        connection.off("HostLeftRoom");
        connection.off("HostInRoom");
        connection.off("YouAreHost");
        connection.off("JoinRequest");
        connection.off("ReceiveMessage");
        connection.invoke("LeaveRoom", id, user.id).catch(console.error);
      };
    }
  }, [connection, user, id, navigate]);

  return (
    <div className="wt-watch-together-room">
      <div className="wt-video-container">
        <h2>Watch Together - Room ID: {id}</h2>
        {isHostLeft && <div>Host left and room will be closed in 30 sec</div>}
        <div className="wt-video-wrapper">
          {isInRoom ? (
            <WatchTogetherVideoPlayer
              roomId={id}
              isPlaying={isPlaying}
              isHost={isHost}
              videoUrl={`https://localhost:7124/api/video/1`}
            />
          ) : (
            <div>Waiting for the host to accept your request...</div>
          )}
        </div>

        {/* Playlist minden esetben a videó alatt */}
        <div className="wt-playlist">
          <h3>{isHost ? "Playlist" : "Next Videos"}</h3>
          <ul>
            {playList.map((video) => (
              <li key={video.id}>
                <div>
                  <img
                    src={`https://localhost:7124/api/video/thumbnail/${video.thumbnailId}`}
                    alt={video.title}
                    className="wt-thumbnail"
                  />
                </div>
                <span>{video.title}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Keresési szekció a playlist alatt */}
        {isHost && (
          <div className="wt-search-section">
            <div className="wt-search-bar">
              <input
                className="wt-search-input"
                type="search"
                placeholder="Search"
                aria-label="Search"
                ref={searchRef}
              />
              <button onClick={handleSearch} className="wt-wtsearch-btn">
                <FaSearch />
              </button>
            </div>
            <div className="wt-video-results">
              {videos.map((video) => (
                <WatchTogetherVideoItem
                  onSelect={onVideoSelect}
                  video={video}
                  key={video.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="wt-sidebar">
        <ChatPanel messages={messages} onMessageSend={sendMessage} />
        <button
          className="wt-toggle-users-btn"
          onClick={() => setShowUsers(!showUsers)}
        >
          {showUsers ? "Hide Users" : "Show Users"}
        </button>
        {showUsers && (
          <div className="wt-user-list">
            <h4>Connected Users</h4>
            <ul>
              {users.map((connectedUser) => (
                <li key={connectedUser.id}>
                  <img
                    src={`https://localhost:7124/api/User/avatar/${connectedUser.avatarId}`}
                    alt={connectedUser.username}
                  />
                  <span>{connectedUser.userName}</span>
                  {isHost && connectedUser.id !== user.id && (
                    <button
                      onClick={() => banUser(connectedUser.id)}
                      className="wt-bg-red-500 wt-text-black wt-hover:bg-red-600"
                    >
                      Ban user
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {isHost && userRequest.length > 0 && (
          <div className="wt-join-requests">
            <h4>Join Requests</h4>
            <ul>
              {userRequest.map((requestUser) => (
                <li key={requestUser.id}>
                  <div>
                    <img
                      src={`https://localhost:7124/api/User/avatar/${requestUser.avatarId}`}
                      alt={requestUser.userName}
                    />
                  </div>
                  <div className="wt-action-buttons">
                    <button
                      className="wt-accept"
                      onClick={() => acceptUser(requestUser.id)}
                    >
                      Accept
                    </button>
                    <button
                      className="wt-reject"
                      onClick={() => rejectUser(requestUser.id)}
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchTogetherRoom;

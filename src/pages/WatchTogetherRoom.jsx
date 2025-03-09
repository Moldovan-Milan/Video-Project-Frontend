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
  const [videos, setVideos] = useState([]);
  const [playList, setPlayList] = useState([]); // Playlist state
  const [currentVideo, setCurrentVideo] = useState(null);

  // Video data
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // UI data
  const [showUsers, setShowUsers] = useState(false);
  const searchRef = useRef();
  const [searchMessage, setSearchMessage] = useState(
    "🤔 Hmmm... What are we searching for? Maybe try typing something in the search bar! \n The magic doesn’t happen until you start typing! ✨"
  );

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
      alert(
        "🚫 You can’t send an empty message... It’s like trying to compile a program with no code! \n Try adding a few characters – even the compiler needs something to work with! 😆"
      );
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
    const searchString = searchRef.current.value.trim();

    if (!searchString) {
      setVideos([]);
      setSearchMessage(
        "🤔 Hmmm... What are we searching for? Maybe try typing something in the search bar! \n The magic doesn’t happen until you start typing! ✨"
      );
      return;
    }

    try {
      const { data } = await axios.get(`/api/video/search/${searchString}`);
      setVideos(data);

      if (data.length === 0) {
        setSearchMessage(
          "😕 No results found. Maybe try searching for '404'? \n Looks like we hit an error, but don’t worry – the code is still running! 💻"
        );
      } else {
        setSearchMessage("");
      }
    } catch (error) {
      console.error("Error searching videos:", error);
      setSearchMessage(
        "🚨 Oops! Something went wrong... Looks like we got caught in an infinite loop! \n 🔄Don’t worry, we're debugging as fast as we can! 🐞💻"
      );
    }
  };

  const onVideoSelect = (video) => {
    connection.invoke("AddVideoToPlaylist", id, video.id);
  };

  const startVideo = (video) => {
    if (isHost) {
      connection.invoke("StartVideo", id, video.id);
    }
  };

  const deleteVideo = (videoId) => {
    if (isHost) {
      connection.invoke("RemoveVideoFromPlayList", id, videoId);
    }
  };

  useEffect(() => {
    if (connection && connection.state === "Connected" && user) {
      connection.on("JoinedToRoom", setUsers);
      connection.on(
        "RequestAccepted",
        (time, isPlaying, messages, playList, currentVideo) => {
          setIsInRoom(true);
          setTime(time);
          if (playList) {
            setPlayList(playList);
          }
          setIsPlaying(isPlaying);
          if (currentVideo) setCurrentVideo(currentVideo);
          if (messages) {
            setMessages(messages);
          }
        }
      );
      connection.on("RequestRejected", () => {
        alert(
          "🚫 Your request to join the room was rejected... Looks like the bouncer didn't like you! 🕵️‍♂️"
        );
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
        alert(
          "🚫 You are banned by the host... Looks like you got kicked out of the virtual party! 🎉"
        );
        navigate("/watch-together");
      });

      connection.on("PlayListChanged", (_playList) => {
        setPlayList(_playList);
      });

      connection.on("StartVideo", (video) => {
        setCurrentVideo(video);
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
        {isHostLeft && (
          <div>
            Uh-oh! The host just Ctrl+Z-ed their way out of here! ⌨️❌
            <br />
            Don’t worry though, the room will close in 30 seconds unless they
            hit Ctrl+Y and return. ⏳ Hurry up, or we’ll all get logged out of
            the fun! 🔓
          </div>
        )}
        <div className="wt-video-wrapper">
          {isInRoom && currentVideo ? (
            <WatchTogetherVideoPlayer
              roomId={id}
              isPlaying={isPlaying}
              isHost={isHost}
              videoUrl={`https://localhost:7124/api/video/${currentVideo.id}`}
            />
          ) : !isHost ? (
            <div>
              Waiting... If the host doesn't respond soon, we might miss the
              premiere! 😬
            </div>
          ) : (
            <div>
              Uh-oh! Looks like we forgot to pick a video... 📽️
              <br />
              Go ahead and choose one from the search – we’re all waiting! ⏳
            </div>
          )}
        </div>

        <div className="wt-playlist">
          <h3>{isHost ? "Playlist" : "Next Videos"}</h3>
          <ul>
            {playList.map((video) => (
              <li
                onClick={() => startVideo(video)}
                key={video.id}
                className={currentVideo?.id === video.id ? "selected" : ""}
              >
                <div>
                  <img
                    src={`https://localhost:7124/api/video/thumbnail/${video.thumbnailId}`}
                    alt={video.title}
                    className="wt-thumbnail"
                  />
                </div>
                <span>{video.title}</span>

                {/* Törlés ikon csak admin esetén és nem a jelenlegi videónál */}
                {isHost && currentVideo?.id !== video.id && (
                  <span
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation(); // Ne indítsa el a videó lejátszást, ha a törlés ikont kattintod
                      deleteVideo(video.id); // Törlés logika
                    }}
                  >
                    🗑️
                  </span>
                )}
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
              {searchMessage && (
                <div className="wt-search-message">{searchMessage}</div>
              )}
              {videos.map(
                (video) =>
                  !playList.some((v) => v.id === video.id) && (
                    <WatchTogetherVideoItem
                      onSelect={onVideoSelect}
                      video={video}
                      key={video.id}
                    />
                  )
              )}
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

import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../components/contexts/UserProvider";
import VideoPlayerWrapper from "../components/VideoPlayerWrapper";
import ChatPanel from "../components/ChatPanel";
import Playlist from "../components/Playlist";
import VideoSearch from "../components/VideoSearch";
import UserList from "../components/UserList";
import JoinRequests from "../components/JoinRequests";
import axios from "axios";
import "../styles/WatchTogetherRoom.scss";
import useWatchTogetherSignalR from "../hooks/useWatchTogetherConnection";

const WatchTogetherRoom = () => {
  const navigate = useNavigate();
  const connection = useWatchTogetherSignalR();
  const { id } = useParams();
  const [safeId, setSafeId] = useState(id);
  const { user } = useContext(UserContext);

  const [isHost, setIsHost] = useState(false);
  const [isHostLeft, setIsHostLeft] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [users, setUsers] = useState([]);
  const [userRequest, setUserRequest] = useState([]);
  const [messages, setMessages] = useState([]);
  const [playList, setPlayList] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const searchRef = useRef();
  const [videos, setVideos] = useState([]);
  const [searchMessage, setSearchMessage] = useState(
    "🤔 Hmmm... What are we searching for? Try typing something in the search bar!"
  );

  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

  const [toggleSearch, setTogleSearch] = useState(true);

  const handleUserAction = (action, userId) => {
    connection.invoke(action, safeId, userId);
    setUserRequest((prev) => prev.filter((u) => u.id !== userId));
  };

  const sendMessage = (content) => {
    if (!content) {
      alert(
        "🚫 You can’t send an empty message... It’s like trying to compile a program with no code! \n Try adding a few characters – even the compiler needs something to work with! 😆"
      );
      return;
    }
    connection.invoke("SendMessage", safeId, user.id, content);
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
      setVideos(data.videos);
      setSearchMessage(
        data.videos.length
          ? ""
          : "😕 No results found. Maybe try searching for '404'?"
      );
    } catch (error) {
      console.error("Error searching videos:", error);
      setSearchMessage(
        "🚨 Oops! Something went wrong... Looks like we got caught in an infinite loop! \n 🔄Don’t worry, we're debugging as fast as we can! 🐞💻"
      );
    }
  };

  useEffect(() => {
    if (connection?.state !== "Connected" || !user) return;
    setSafeId(id);

    const eventHandlers = {
      JoinedToRoom: setUsers,
      RequestAccepted: (time, isPlaying, messages, playList, currentVideo) => {
        setIsInRoom(true);
        setIsPlaying(isPlaying);
        setPlayList(playList || []);
        setCurrentVideo(currentVideo);
        setMessages(messages || []);
      },
      RequestRejected: () => {
        alert("🚫 Your request was rejected.");
        navigate("/watch-together");
      },
      LeavedRoom: setUsers,
      HostLeftRoom: () => setIsHostLeft(true),
      HostInRoom: () => setIsHostLeft(false),
      YouAreHost: (messages) => {
        setIsHost(true);
        setIsInRoom(true);
        setMessages(messages || []);
      },
      JoinRequest: (u) => setUserRequest((prev) => [...prev, u]),
      ReceiveMessage: (message) => setMessages((prev) => [...prev, message]),
      YouAreBanned: () => {
        alert("🚫 You are banned.");
        navigate("/watch-together");
      },
      PlayListChanged: setPlayList,
      StartVideo: setCurrentVideo,
      RoomClosed: () => {
        alert("The host disconnected.");
        navigate("/watch-together");
      },
      Error: console.log,
      ConnectFailed: () => {
        alert("Connection failed");
        navigate("/watch-together");
      },
    };

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      connection.on(event, handler);
    });

    connection.invoke("JoinRoom", safeId, user.id).catch(console.error);

    return () => {
      Object.keys(eventHandlers).forEach((event) => connection.off(event));
      connection.invoke("LeaveRoom", safeId, user.id).catch(console.error);
      connection.stop();
    };
  }, [connection, user, safeId, navigate]);

  return (
    <div className="wt-watch-together-room">
      <div className="wt-video-container">
        <h2 className="text-center">Watch Together - Room ID: {id}</h2>
        {isHostLeft && (
          <div>
            Uh-oh! The host just Ctrl+Z-ed their way out of here! ⌨️❌
            <br />
            Don’t worry though, the room will close in 30 seconds unless they
            hit Ctrl+Y and return. ⏳ Hurry up, or we’ll all get logged out of
            the fun! 🔓
          </div>
        )}
        <VideoPlayerWrapper
          {...{ isInRoom, currentVideo, isPlaying, isHost, id, connection }}
        />
        <Playlist
          {...{
            playList,
            currentVideo,
            isHost,
            startVideo: (video) =>
              connection.invoke("StartVideo", safeId, video.id),
            deleteVideo: (videoId) =>
              connection.invoke("RemoveVideoFromPlayList", safeId, videoId),
          }}
        />
        <h2 className="text-center m-5">Add videos to your playlist</h2>
        {isHost && (
          <button
            className="W2GSearchButton"
            onClick={() => setTogleSearch(!toggleSearch)}
          >
            {!toggleSearch?"Click here to search for videos":"Close search section"}
          </button>
        )}
        {isHost && toggleSearch && (
          <VideoSearch
            {...{
              searchRef,
              handleSearch,
              searchMessage,
              videos,
              playList,
              onVideoSelect: (video) =>
                connection.invoke("AddVideoToPlaylist", safeId, video.id),
            }}
          />
        )}
      </div>

      {isInRoom && (
        <div className="wt-sidebar">
          <ChatPanel {...{ messages, onMessageSend: sendMessage }} />
          <UserList
            {...{
              users,
              isHost,
              user,
              banUser: (userId) =>
                isHost && connection.invoke("BanUser", safeId, userId),
            }}
          />
          <JoinRequests
            {...{
              isHost,
              userRequest,
              acceptUser: (userId) => handleUserAction("AcceptUser", userId),
              rejectUser: (userId) => handleUserAction("RejectUser", userId),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WatchTogetherRoom;

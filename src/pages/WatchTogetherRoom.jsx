import React, { useContext, useEffect, useRef, useState } from "react";
import { useWTSignalR } from "../components/contexts/WatchTogetherSingalRProvider";
import { useNavigate, useParams } from "react-router-dom";
import WatchTogetherVideoPlayer from "../components/WatchTogetherVideoPlayer";
import { UserContext } from "../components/contexts/UserProvider";
import ChatPanel from "../components/ChatPanel";
import "../output.css";
import "../index.css";
import "../styles/WatchTogetherRoom.scss";

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

  // Video data
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

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
    <div className="min-h-screen bg-black text-white p-6 flex">
      <div className="flex-2 w-2/3">
        <h2 className="text-4xl font-bold text-lime-400 mb-6">
          Watch Together - Room ID: {id}
        </h2>
        {isHostLeft && <div>Host left and room will be closed in 30 sec</div>}

        <div className="mt-6 w-full max-w-4xl">
          {isInRoom ? (
            <WatchTogetherVideoPlayer
              roomId={id}
              isPlaying={isPlaying}
              isHost={isHost}
              videoUrl={`https://localhost:7124/api/video/1`}
            />
          ) : (
            <div className="text-center text-gray-400 text-xl">
              Waiting for the host to accept your request...
            </div>
          )}
        </div>
      </div>

      {/* Üzenetfal és kezelőfelület */}
      <ChatPanel messages={messages} onMessageSend={sendMessage} />

      {/* Request kezelése */}
      {isHost && userRequest.length > 0 && (
        <div className="mt-4 text-lime-400">
          <h4 className="text-lg">Join Requests</h4>
          <ul className="space-y-2">
            {userRequest.map((requestUser) => (
              <li
                key={requestUser.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={`https://localhost:7124/api/User/avatar/${requestUser.avatarId}`}
                    alt={requestUser.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span>{requestUser.userName}</span>
                </div>
                <div>
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => acceptUser(requestUser.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
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
  );
};

export default WatchTogetherRoom;

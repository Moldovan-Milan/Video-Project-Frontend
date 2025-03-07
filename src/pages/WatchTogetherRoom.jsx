import React, { useContext, useEffect, useState } from "react";
import { useWTSignalR } from "../components/contexts/WatchTogetherSingalRProvider";
import { useNavigate, useParams } from "react-router-dom";
import WatchTogetherVideoPlayer from "../components/WatchTogetherVideoPlayer";
import { UserContext } from "../components/contexts/UserProvider";

const WatchTogetherRoom = () => {
  const navigate = useNavigate();
  const connection = useWTSignalR();
  const { id } = useParams();
  const { user } = useContext(UserContext);

  const [isHost, setIsHost] = useState(false);
  const [isHostLeft, setIsHostLeft] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [users, setUsers] = useState([]);
  const [userRequest, setUserRequest] = useState([]);
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  useEffect(() => {
    if (connection && connection.state === "Connected" && user) {
      connection.on("JoinedToRoom", setUsers);
      connection.on("RequestAccepted", (time, isPlaying) => {
        setIsInRoom(true);
        setTime(time);
        setIsPlaying(isPlaying);
      });
      connection.on("RequestRejected", () => {
        alert("Your request to join the room was rejected.");
        navigate("/watch-together");
      });
      connection.on("LeavedRoom", setUsers);
      connection.on("HostLeftRoom", () => setIsHostLeft(true));
      connection.on("HostInRoom", () => setIsHostLeft(false));
      connection.on("YouAreHost", () => {
        setIsHost(true);
        setIsInRoom(true);
      });
      connection.on("JoinRequest", (u) =>
        setUserRequest((prev) => [...prev, u])
      );

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
        connection.invoke("LeaveRoom", id, user.id).catch(console.error);
      };
    }
  }, [connection, user, id, navigate]);

  const acceptUser = (userId) => {
    connection.invoke("AcceptUser", id, userId);
    setUserRequest((prev) => prev.filter((u) => u.id !== userId));
  };

  const rejectUser = (userId) => {
    connection.invoke("RejectUser", id, userId);
    setUserRequest((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-lime-400 mb-6">
        Watch Together - Room ID: {id}
      </h2>

      {isHost && userRequest.length > 0 && (
        <div className="mb-4 w-full max-w-4xl bg-gray-900 p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-lime-400 mb-2">
            Join Requests
          </h3>
          {userRequest.map((u) => (
            <div
              key={u.id}
              className="flex items-center space-x-3 bg-gray-800 p-3 rounded-lg mb-2"
            >
              <img
                src={`https://localhost:7124/api/User/avatar/${u.avatarId}`}
                alt={u.userName}
                className="w-12 h-12 rounded-full border border-purple-400"
              />
              <span className="text-purple-300">{u.userName}</span>
              <button
                className="bg-lime-500 hover:bg-lime-600 px-3 py-1 rounded-lg"
                onClick={() => acceptUser(u.id)}
              >
                Accept
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                onClick={() => rejectUser(u.id)}
              >
                Reject
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg mb-4"
        onClick={() => setShowUsers(!showUsers)}
      >
        {showUsers ? "Hide Users" : "Show Users"}
      </button>

      {showUsers && (
        <div className="w-full max-w-4xl bg-gray-900 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-lime-400 mb-2">
            Users in Room
          </h3>
          <div className="flex flex-wrap gap-4">
            {users.length > 0 ? (
              users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg"
                >
                  <img
                    src={`https://localhost:7124/api/User/avatar/${u.avatarId}`}
                    alt={u.userName}
                    className="w-12 h-12 rounded-full border border-lime-400"
                  />
                  <span className="text-lime-300">{u.userName}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No users in the room yet.</p>
            )}
          </div>
        </div>
      )}

      {isHostLeft && (
        <span className="mt-4 text-red-400 font-semibold">
          Host left the room. Room will be closed in 10s.
        </span>
      )}

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
  );
};

export default WatchTogetherRoom;

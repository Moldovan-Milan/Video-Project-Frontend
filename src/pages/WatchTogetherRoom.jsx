import React, { useContext, useEffect, useState } from "react";
import { useWTSignalR } from "../components/contexts/WatchTogetherSingalRProvider";
import { useParams } from "react-router-dom";
import WatchTogetherVideoPlayer from "../components/WatchTogetherVideoPlayer";
import { UserContext } from "../components/contexts/UserProvider";

const WatchTogetherRoom = () => {
  const connection = useWTSignalR();
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const { user } = useContext(UserContext);
  const [isHost, setIsHost] = useState(false);
  const [isHostLeft, setIsHostLeft] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (connection && connection.state === "Connected" && user) {
      connection.on("JoinedToRoom", (users) => setUsers(users));
      connection.on("LeavedRoom", (users) => setUsers(users));
      connection.on("HostLeftRoom", () => setIsHostLeft(true));
      connection.on("HostInRoom", () => setIsHostLeft(false));

      connection
        .invoke("JoinRoom", id, user.id)
        .then(() => console.log("JoinRoom sikeresen meghívva"))
        .catch((err) => console.error("Hiba a JoinRoom meghívásakor:", err));

      connection.on("YouAreHost", () => {
        console.log("I am host");
        setIsHost(true);
      });

      return () => {
        connection
          .invoke("LeaveRoom", id, user.id)
          .then(() => console.log("LeaveRoom sikeresen meghívva"))
          .catch((err) => console.error("Hiba a LeaveRoom meghívásakor:", err));
      };
    }
  }, [connection, user, id]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Watch Together - Room ID: {id}
      </h2>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          {users && users.length > 0 ? (
            users.map((u) => (
              <div key={u.id} className="flex items-center space-x-2">
                <img
                  src={`https://localhost:7124/api/User/avatar/${u.avatarId}`}
                  alt={u.userName}
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-sm font-medium">{u.userName}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No users in the room yet.</p>
          )}
        </div>
        {isHostLeft && (
          <span className="text-red-700 font-semibold">
            Host left the room. Room will be closed in 10s.
          </span>
        )}
      </div>

      <div className="mb-6">
        <WatchTogetherVideoPlayer
          roomId={id}
          isHost={isHost}
          videoUrl={`https://localhost:7124/api/video/${3}`}
        />
      </div>
    </div>
  );
};

export default WatchTogetherRoom;

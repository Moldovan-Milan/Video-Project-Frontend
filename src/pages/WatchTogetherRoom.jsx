import React, { useContext, useEffect, useState } from "react";
import { useWTSignalR } from "../components/contexts/WatchTogetherSingalRProvider";
import { useParams, useSearchParams } from "react-router-dom";
import WatchTogetherVideoPlayer from "../components/WatchTogetherVideoPlayer";
import { UserContext } from "../components/contexts/UserProvider";

const WatchTogetherRoom = () => {
  const connection = useWTSignalR();
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const { user } = useContext(UserContext);
  const [isHost, setIsHost] = useState(false);
  const [isHostLeft, setIsHostLeft] = useState(false);

  useEffect(() => {
    if (connection && connection.state === "Connected" && user) {
      connection.on("JoinedToRoom", () => console.log("Joined to room"));
      connection.on("LeavedRoom", () => console.log("Room leaved"));
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
    <div>
      <h2>Watch Together - Room ID: {id}</h2>
      {isHostLeft && (
        <span className="text-red-700">
          Host left the room. Room will be closed in 10s
        </span>
      )}
      <WatchTogetherVideoPlayer
        roomId={id}
        isHost={isHost}
        videoUrl={`https://localhost:7124/api/video/${1}`}
      />
    </div>
  );
};

export default WatchTogetherRoom;

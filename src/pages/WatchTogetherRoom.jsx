import React, { useEffect } from "react";
import { useWTSignalR } from "../components/contexts/WatchTogetherSingalRProvider";
import { useParams } from "react-router-dom";
import WatchTogetherVideoPlayer from "../components/WatchTogetherVideoPlayer";

const WatchTogetherRoom = () => {
  const connection = useWTSignalR();
  const { id } = useParams();
  const videoUrl = "https://localhost:7124/api/video/1";

  useEffect(() => {
    if (connection && connection.state === "Connected" && id) {
      connection.on("JoinedToRoom", () => {
        console.log("Joined to room");
      });

      connection.on("LeavedRoom", () => {
        console.log("Room leaved");
      });

      connection
        .invoke("JoinRoom", id)
        .then(() => console.log("JoinRoom sikeresen meghívva"))
        .catch((err) => console.error("Hiba a JoinRoom meghívásakor:", err));

      return () => {
        connection
          .invoke("LeaveRoom", id)
          .then(() => console.log("LeaveRoom sikeresen meghívva"))
          .catch((err) => console.error("Hiba a LeaveRoom meghívásakor:", err));
      };
    }
  }, [connection, id]);

  return (
    <div>
      <h2>Watch Together - Szoba ID: {id}</h2>
      <WatchTogetherVideoPlayer roomId={id} videoUrl={videoUrl} />
    </div>
  );
};

export default WatchTogetherRoom;

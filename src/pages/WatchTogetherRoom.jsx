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

  // Átméretezéshez szükséges állapotok
  const [videoWidth, setVideoWidth] = useState(66); // Alapértelmezett szélesség (2/3)
  const [isResizing, setIsResizing] = useState(false);

  // Rögzítjük a pozíciót, hogy ne lépje túl a szegmenseket
  const handleMouseDown = (e) => {
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      // Az egér pozíciója az ablak szélességén belül
      const minWidth = 30; // Minimális szélesség (30%)
      const maxWidth = window.innerWidth - 200; // Maximális szélesség, figyelembe véve az üzenetfal szélességét (max. 80%-os videó szélesség)

      // Kiszámoljuk az új szélességet az egér X pozíciójából
      let newWidth = (e.clientX / window.innerWidth) * 100;

      // A szélességet korlátozzuk
      newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));

      setVideoWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Show all users és request kezelők
  const toggleShowUsers = () => {
    setShowUsers((prev) => !prev);
  };

  const acceptUser = (userId) => {
    connection.invoke("AcceptUser", id, userId);
    setUserRequest((prev) => prev.filter((u) => u.id !== userId));
  };

  const rejectUser = (userId) => {
    connection.invoke("RejectUser", id, userId);
    setUserRequest((prev) => prev.filter((u) => u.id !== userId));
  };

  // Avatar hiba kezelés alapértelmezett képpel
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/32"; // Ha nem található a kép, helyette ezt a kép URL-t használjuk
  };

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

  return (
    <div
      className="min-h-screen bg-black text-white p-6 flex"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="flex-2"
        style={{ width: `${videoWidth}%` }} // Dinamikusan változó szélesség
      >
        <h2 className="text-4xl font-bold text-lime-400 mb-6">
          Watch Together - Room ID: {id}
        </h2>

        {/* A többi tartalom itt marad */}

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

      {/* Átméretezési zóna az üzenetfal mellett */}
      <div
        className="w-1/3 bg-gray-800 p-4 rounded-lg shadow-lg"
        onMouseDown={handleMouseDown}
        style={{
          borderLeft: "2px solid rgba(255, 255, 255, 0.2)", // Halvány vonal az üzenetfal szélén
          cursor: isResizing ? "ew-resize" : "default", // Dinamikus kurzor változtatás
        }}
      >
        <h3 className="text-xl font-semibold text-lime-400 mb-4">Messages</h3>
        <div className="bg-gray-700 h-72 p-4 rounded-lg mb-4 overflow-auto">
          {/* Üzenetek megjelenítése */}
        </div>
        <input
          type="text"
          className="w-full p-2 bg-gray-600 rounded-lg text-white"
          placeholder="Type your message..."
        />

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
                      onError={handleImageError} // Hiba kezelés
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

        {/* Show all users */}
        <button
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
          onClick={toggleShowUsers}
        >
          {showUsers ? "Hide Users" : "Show All Users"}
        </button>

        {showUsers && (
          <div className="mt-4 text-lime-400">
            <h4 className="text-lg">Users in Room</h4>
            <ul className="space-y-2">
              {users.map((u) => (
                <li key={u.id} className="flex items-center space-x-2">
                  <img
                    src={`https://localhost:7124/api/User/avatar/${u.avatarId}`}
                    alt={u.userName}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={handleImageError} // Hiba kezelés
                  />
                  <span>{u.userName}</span>
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

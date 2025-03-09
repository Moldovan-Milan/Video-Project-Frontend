import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { generateId } from "../functions/generateId";
import { useNavigate } from "react-router-dom";

const ROOM_ID_LENGTH = 6;

const WatchTogetherMainPage = () => {
  const [method, setMethod] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideos, setSelectedVideos] = useState(); // Most még csak 1 megy
  const navigate = useNavigate();
  const roomIdRef = useRef();
  const videoIdRef = useRef();

  useEffect(() => {
    const fetchVideos = async () => {
      const { data } = await axios.get("/api/video");
      setVideos(data);
    };

    fetchVideos();
  }, []);

  const createRoom = () => {
    const videoId = videoIdRef.current.value;
    if (videoId) {
      const roomId = generateId(ROOM_ID_LENGTH);
      navigate(`/watch-together/${roomId}?videoId=${videoId}`);
    }
  };

  const joinRoom = () => {
    const roomId = roomIdRef.current.value;
    if (roomId) {
      navigate(`/watch-together/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Watch Together</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-700 transition"
          onClick={() => setMethod("create")}
        >
          Create Room
        </button>
        <button
          className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          onClick={() => setMethod("join")}
        >
          Join Room
        </button>
      </div>

      {method === "create" && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Add Video to Playlist</h2>
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {videos.map((video, id) => (
              <WatchTogehterVideoItem
                setSelectedVideo={setSelectedVideos}
                key={id}
                video={video}
              />
            ))}
          </div> */}
          <label htmlFor="videoId"></label>
          <input
            type="number"
            className="text-black"
            ref={videoIdRef}
            id="videoId"
            placeholder="Enter video id"
          ></input>
          <button
            onClick={createRoom}
            className="mt-4 bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Create
          </button>
        </div>
      )}

      {method === "join" && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <label htmlFor="joinInput" className="block text-lg mb-2">
            Enter Room Code:
          </label>
          <input
            id="joinInput"
            placeholder="Room code"
            className="w-full p-2 rounded-lg text-gray-900"
            ref={roomIdRef}
          />
          <button
            onClick={joinRoom}
            className="mt-4 bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-700 transition w-full"
          >
            Join
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchTogetherMainPage;

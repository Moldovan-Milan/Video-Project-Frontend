import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { generateId } from "../functions/generateId";
import { useNavigate } from "react-router-dom";
import "../styles/WatchTogetherMainPage.scss"

const ROOM_ID_LENGTH = 6;

const WatchTogetherMainPage = () => {
  const [method, setMethod] = useState("");
  const navigate = useNavigate();
  const roomIdRef = useRef();

  const createRoom = () => {
    const roomId = generateId(ROOM_ID_LENGTH);
    navigate(`/watch-together/${roomId}`);
  };

  const joinRoom = () => {
    const roomId = roomIdRef.current.value;
    if (roomId) {
      navigate(`/watch-together/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 w2gMain">
      <h1 className="text-3xl font-bold text-center mb-6 W2Gh1">Watch Together</h1>

      <div className="flex justify-center space-x-4 mb-6">
        <button
          className="px-4 py-2 rounded-lg transition btnW2GCreateR"
          onClick={() => setMethod("create")}
        >
          Create Room
        </button>
        <button
          className="px-4 py-2 rounded-lg transition btnW2GJoinR"
          onClick={() => setMethod("join")}
        >
          Join Room
        </button>
      </div>

      {method === "create" && (
          <button
            onClick={createRoom}
            className="mt-4 px-4 py-2 rounded-lg  transition btnCreateW2G"
          >
            Create
          </button>
      )}

      {method === "join" && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <label htmlFor="joinInput" className="block text-lg mb-2">
            Enter Room Code:
          </label>
          <input
            id="joinInput"
            placeholder="Room code"
            className="w-full p-2 rounded-lg text-gray-900 inputW2Gcode"
            ref={roomIdRef}
          />
          <button
            onClick={joinRoom}
            className="mt-4 bg-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-700 transition w-full btnW2GJoin"
          >
            Join
          </button>
        </div>
      )}
    </div>
  );
};

export default WatchTogetherMainPage;

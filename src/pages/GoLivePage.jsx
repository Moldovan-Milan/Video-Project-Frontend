import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCamera, FaDesktop, FaPlay, FaStop } from "react-icons/fa";
import "../styles/GoLivePage.scss";
import {
  createSignalRConnection as createSignalR,
  invokeSignalRMethod,
  startSignalRConnection,
  stopSignalRConnection,
} from "../utils/signalRUtils";
import { UserContext } from "../components/contexts/UserProvider";

const MediaSharing = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const videoRef = useRef(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [stream, setStream] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamURL, setStreamURL] = useState(null);
  const { user } = useContext(UserContext);
  const [connection, setConnection] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});

  const createSignalRConnection = async () => {
    const newConnection = createSignalR(BASE_URL, "live");

    newConnection.on("LiveStreamStarted", async (id) => {
      setStreamURL(id);
    });

    newConnection.on("ViewerConnected", async (connId) => {
      await handleViewerConnection(connId, newConnection);
    });

    newConnection.on("ReceiveOffer", async (viewerId, offer) => {
      await handleViewerConnection(viewerId, offer, newConnection);
    });

    await startSignalRConnection(newConnection, setConnection);
    await invokeSignalRMethod(
      newConnection,
      "StartStream",
      user.id,
      title,
      description
    );
  };

  const handleViewerConnection = async (viewerId, newConnection) => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const newPeerConnection = new RTCPeerConnection(configuration);
    peerConnections[viewerId] = newPeerConnection;

    console.log(`Viewer connected: ${viewerId}`);

    // Itt adjuk hozzá a képernyő megosztást
    stream.getTracks().forEach((track) => {
      console.log("Add track");
      newPeerConnection.addTrack(track, stream);
    });

    newConnection.on("ReceiveAnswer", async (answer) => {
      console.log("Receiwe Answer");
      await newPeerConnection.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(answer))
      );
      console.log(peerConnections);
    });

    // Ice candidate beállítása
    newConnection.on("ReceiveIceCandidate", async (candidate) => {
      if (newPeerConnection && candidate) {
        console.log("Received ICE Candidate:", candidate);
        await newPeerConnection.addIceCandidate(
          new RTCIceCandidate(JSON.parse(candidate))
        );
      } else {
        console.warn("PeerConnection not ready for ICE candidate");
      }
    });

    // Ice candidate elküldése
    newPeerConnection.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        console.log("Ice candidate");
        invokeSignalRMethod(
          newConnection,
          "SendIceCandidate",
          viewerId,
          JSON.stringify(event.candidate)
        );
      }
    });

    const offer = await newPeerConnection.createOffer();
    await newPeerConnection.setLocalDescription(offer);

    newPeerConnection.addEventListener("icecandidateerror", (event) => {
      console.log("Ice error: ", event);
    });

    // Offer (ajánlat) elküdlése a kapcsolat kezdeményezéséhez
    invokeSignalRMethod(
      newConnection,
      "SendOffer",
      viewerId,
      JSON.stringify(offer)
    );

    //   try {
    //     const remoteDesc = new RTCSessionDescription(JSON.parse(offer));
    //     await newPeerConnection.setRemoteDescription(remoteDesc);
    //     console.log(`Remote offer set for viewer: ${viewerId}`);

    //     const answer = await newPeerConnection.createAnswer();
    //     await newPeerConnection.setLocalDescription(answer);
    //     console.log(`Local answer set for viewer: ${viewerId}`);

    //     invokeSignalRMethod(
    //       connection,
    //       "SendAnswer",
    //       viewerId,
    //       JSON.stringify(answer)
    //     );

    // newPeerConnection.addEventListener("icecandidateerror", event => {
    //   console.log(event)
    // })

    //     newPeerConnection.addEventListener("icecandidate", event => {
    //       if (event.candidate) {
    //         invokeSignalRMethod(
    //           connection,
    //           "SendIceCandidate",
    //           streamerId,
    //           JSON.stringify(event.candidate)
    //         );
    //       }
    //     });
    //   } catch (error) {
    //     console.error(`Error handling viewer ${viewerId}:`, error);
    //   }

    //   console.log(peerConnections)
  };

  const handleScreenSelected = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      setStream(screenStream);
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
      setSelectedSource("screen");
      screenStream.getTracks()[0].onended = stopSharing;
    } catch (err) {
      console.error("Error sharing screen:", err);
    }
  };

  const handleCameraSelected = async () => {
    try {
      setSelectedSource("camera");
      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(webcamStream);
      if (videoRef.current) {
        videoRef.current.srcObject = webcamStream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const GoLive = async () => {
    if (!selectedSource || !title) {
      window.alert("Enter valid title, and select a streaming method!");
      return;
    }

    try {
      await createSignalRConnection();
      setIsStreaming(true);
    } catch (error) {
      console.error("Error starting stream:", error);
    }
  };

  const stopSharing = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setSelectedSource(null);
      setStream(null);
      setIsStreaming(false);

      if (connection) {
        await invokeSignalRMethod(connection, "StopStream", user.id);
        stopSignalRConnection(connection);
        setConnection(null);
      }
    }
  };

  return (
    <div className="goLiveContainer">
      <h1>Media Sharing</h1>
      {!isStreaming && (
        <>
          <label>Title: </label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="text-black"
          />
          <label>Description: </label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="text-black"
          />
        </>
      )}
      <div>
        {!isStreaming && (
          <>
            <button
              onClick={handleScreenSelected}
              className={
                selectedSource === "screen" ? "selectedSourceBtn" : "sourceBtn"
              }
            >
              <FaDesktop className="m-1" /> Go live by sharing your screen
            </button>
            <button
              onClick={handleCameraSelected}
              className={
                selectedSource === "camera" ? "selectedSourceBtn" : "sourceBtn"
              }
            >
              <FaCamera className="m-1" /> Go live with webcam
            </button>
            <button
              onClick={GoLive}
              className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mb-2 flex"
            >
              <FaPlay className="m-1" /> Go Live
            </button>
          </>
        )}
        {isStreaming && (
          <button
            onClick={stopSharing}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 flex"
          >
            <FaStop className="m-1" /> Stop Sharing
          </button>
        )}
      </div>
      {isStreaming && <h2>Your stream code: {streamURL}</h2>}
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
    </div>
  );
};

export default MediaSharing;

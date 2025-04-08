import React, { useContext, useEffect, useRef, useState } from "react";
import { FaCamera, FaDesktop, FaEye, FaPlay, FaStop } from "react-icons/fa";
import "../styles/GoLivePage.scss";
import {
  createSignalRConnection as createSignalR,
  invokeSignalRMethod,
  startSignalRConnection,
  stopSignalRConnection,
} from "../utils/signalRUtils";
import { UserContext } from "../components/contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import ChatPanel from "../components/ChatPanel";

const MediaSharing = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const videoRef = useRef(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [stream, setStream] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamURL, setStreamURL] = useState(null);
  const [viewerCount, setViewerCount] = useState(0);
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  // WebRTC
  const connectionRef = useRef(null);
  const [peerConnections, setPeerConnections] = useState({});
  const pendingCandidates = {};

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }

    return () => {
      console.log("Return");
      if (connectionRef.current) {
        connectionRef.current.invoke("StopStream", user.id);
        connectionRef.current.stop();
      }
    };
  }, []);

  const handleScreenSelected = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      let combinedStream;
      try {
        const micStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        combinedStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...screenStream.getAudioTracks(),
          ...micStream.getAudioTracks(),
        ]);
      } catch {
        combinedStream = new MediaStream([
          ...screenStream.getVideoTracks(),
          ...screenStream.getAudioTracks(),
        ]);
      }
      setStream(combinedStream);

      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
        videoRef.current.muted = true;
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
        videoRef.current.muted = true;
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
      await startLiveStream();
    } catch (error) {
      console.error("Error starting stream:", error);
    }
  };

  const stopSharing = async () => {
    if (stream) {
      setMessages([]);
      stream.getTracks().forEach((track) => track.stop());
      setSelectedSource(null);
      setStream(null);
      setIsStreaming(false);

      if (connectionRef.current) {
        try {
          await invokeSignalRMethod(
            connectionRef.current,
            "StopStream",
            user.id
          );
          stopSignalRConnection(connectionRef.current);
          setConnection(null);
        } catch (error) {
          console.log("Error during stop: ", error);
        }
      }
    }
  };

  const startLiveStream = async () => {
    try {
      const signalRConnection = createSignalR(BASE_URL, "live");

      signalRConnection.on("LiveStreamStarted", (streamId) => {
        setStreamURL(streamId);
        setIsStreaming(true);
      });

      signalRConnection.on("StreamStopped", () => {
        setIsStreaming(false);
        stopSignalRConnection(connectionRef.current);
        setTitle("");
        setDescription("");
        setStreamURL("");
      });

      signalRConnection.on("ReceiveViewer", (viewerId) => {
        handleViewer(viewerId, signalRConnection);
      });

      signalRConnection.on("ReceiveMessage", (message) => {
        console.log("Receive message");
        console.log(message);
        setMessages((prev) => [...prev, message]);
      });

      signalRConnection.on("ReceiveAnswer", (answer, viewerId) => {
        if (!viewerId) {
          console.error("Received answer but viewerId is undefined");
          return;
        }
        handleAnswer(JSON.parse(answer), viewerId);
      });

      signalRConnection.on("ReceiveIceCandidate", (candidate, connId) => {
        if (!connId) {
          console.error("Received answer but viewerId is undefined");
          return;
        }
        handleIceCandidate(JSON.parse(candidate), connId);
      });

      signalRConnection.on("ViewerLeftStream", (viewerId) => {
        if (viewerId) {
          console.log("Viewer disconected!");
          peerConnections[viewerId].close();
          delete peerConnections[viewerId];
        }
      });

      signalRConnection.on("ViewerCountChanged", (count) => {
        setViewerCount(count);
      });

      //await startSignalRConnection(signalRConnection, setConnection);
      try {
        await signalRConnection.start();
        connectionRef.current = signalRConnection;
        console.log("SignalR connection started");
      } catch (err) {
        console.error("Error while starting the SignalR connection", err);
      }

      signalRConnection.invoke("StartStream", user.id, title, description);
      // invokeSignalRMethod(
      //   connection,
      //   "StartStream",
      //   user.id,
      //   title,
      //   description
      // );
    } catch (error) {
      console.log("Error happend during the start: ", error);
    }
  };

  const handleViewer = async (viewerId, connection) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
      ],
    });

    stream.getTracks().forEach((track) => {
      console.log("addPeer");
      peer.addTrack(track, stream);
    });

    const offer = await peer.createOffer();
    peer.setLocalDescription(offer);

    peer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        console.log(`Send ice candidate for: ${viewerId}`);
        invokeSignalRMethod(
          connection,
          "SendIceCandidate",
          viewerId,
          JSON.stringify(event.candidate)
        );
      }
    });

    //connection.invoke("SendOffer", viewerId, JSON.stringify(offer));

    await invokeSignalRMethod(
      connection,
      "SendOffer",
      viewerId,
      JSON.stringify(offer)
    );
    peerConnections[viewerId] = peer;
  };

  const handleAnswer = (answer, viewerId) => {
    const peer = peerConnections[viewerId];
    if (!peer) {
      console.error(`No peer connection found for viewerId: ${viewerId}`);
      return;
    }

    peer
      .setRemoteDescription(new RTCSessionDescription(answer))
      .then(() => {
        if (pendingCandidates[viewerId]) {
          pendingCandidates[viewerId].forEach((candidate) => {
            peer
              .addIceCandidate(new RTCIceCandidate(candidate))
              .catch(console.error);
          });
          delete pendingCandidates[viewerId];
        }
      })
      .catch(console.error);
  };

  const handleIceCandidate = async (candidate, viewerId) => {
    const peer = peerConnections[viewerId];

    if (!peer) {
      console.error(`No peer connection found for viewerId: ${viewerId}`);
      return;
    }

    if (peer.remoteDescription) {
      console.log("Adding ICE candidate immediately");
      await peer
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch(console.error);
    } else {
      console.log("Storing ICE candidate for later");
      if (!pendingCandidates[viewerId]) {
        pendingCandidates[viewerId] = [];
      }
      pendingCandidates[viewerId].push(candidate);
    }
  };

  const onMessageSend = (content) => {
    if (!content) {
      alert("You can not send empty message!");
      return;
    }
    if (connectionRef.current) {
      connectionRef.current.invoke("SendMessage", user.id, content, streamURL);
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
      <div>
        <video ref={videoRef} autoPlay playsInline style={{ width: "90%" }} />
        {streamURL && (
          <div>
            <h3>
              Viewers: {viewerCount} <FaEye />
            </h3>
          </div>
        )}
        <ChatPanel messages={messages} onMessageSend={onMessageSend} />
      </div>
    </div>
  );
};

export default MediaSharing;

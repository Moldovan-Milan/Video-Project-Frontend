import React, { useEffect, useState, useRef, useContext } from "react";
import {
  createSignalRConnection,
  invokeSignalRMethod,
  startSignalRConnection,
} from "../utils/signalRUtils";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../components/contexts/UserProvider";
import ChatPanel from "../components/WatchTogether/ChatPanel";

const LiveStreamPage = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [viewerCount, setViewerCount] = useState(0);
  const connectionRef = useRef(null);
  //const [streamerConnId, setStreamerConnId] = useState(null);

  const peerConnectionRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const pendingCandidates = [];

  useEffect(() => {
    try {
      createSignalConn();
    } catch (error) {
      console.log("Error: ", error);
    }

    return () => {
      try {
        console.log(connectionRef.current, " Leave stream function");
        connectionRef.current.invoke("LeaveStream", id);
        connectionRef.current.stop();
        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
        }
      } catch (error) {
        console.log(error);
      }
    };
  }, []);

  const createSignalConn = async () => {
    const signalRConnection = createSignalRConnection(BASE_URL, "live");

    signalRConnection.on("ReceiveOffer", (offer, connId) => {
      createPeer(JSON.parse(offer), connId, signalRConnection);
    });

    signalRConnection.on("ReceiveIceCandidate", (candidate, _) => {
      handleIceCandidate(JSON.parse(candidate));
    });

    signalRConnection.on("StreamStopped", () => {
      alert("Stream stopped :(");
      navigate("/livestream");
    });

    signalRConnection.on("ReceiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    signalRConnection.on("ReceiveChatHistory", (chatHistory) => {
      setMessages(chatHistory);
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

    await invokeSignalRMethod(signalRConnection, "WatchStream", id);
  };

  const createPeer = async (offer, streamerId, connection) => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org",
        },
      ],
    });

    peer.addEventListener("track", async (event) => {
      const stream = event.streams[0];
      remoteVideoRef.current.srcObject = stream;
    });
    peer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        console.log("Send ice candidate for the streamer");
        invokeSignalRMethod(
          connection,
          "SendIceCandidate",
          streamerId,
          JSON.stringify(event.candidate)
        );
      }
    });

    await peer.setRemoteDescription(new RTCSessionDescription(offer));

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    invokeSignalRMethod(
      connection,
      "SendAnswer",
      streamerId,
      JSON.stringify(answer)
    );
    peerConnectionRef.current = peer;

    pendingCandidates.forEach((candidate, idx) => {
      console.log(candidate);
      peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      delete pendingCandidates[idx];
      console.log("Set ice candidate");
    });

    console.log(pendingCandidates);
  };

  const handleIceCandidate = async (candidate) => {
    if (peerConnectionRef.current) {
      console.log("Set ice candidate");
      await peerConnectionRef.current.addIceCandidate(
        new RTCIceCandidate(candidate)
      );
    } else {
      console.log("Store candidate");
      pendingCandidates.push(candidate);
    }
    //console.log(peerConnectionRef.current);
  };

  const onMessageSend = (content) => {
    if (user) {
      if (!content) {
        return;
      }
      if (connectionRef.current) {
        connectionRef.current.invoke("SendMessage", user.id, content, id);
      }
    } else {
      alert("You must have an account");
    }
  };

  return (
    <div>
      <h2>Live Stream</h2>
      <video
        ref={remoteVideoRef}
        controls
        autoPlay
        playsInline
        style={{ width: "80%", border: "1px solid black" }}
      />
      <h3>Viewers: {viewerCount}</h3>
      <ChatPanel messages={messages} onMessageSend={onMessageSend} />
    </div>
  );
};

export default LiveStreamPage;

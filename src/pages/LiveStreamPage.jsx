import React, { useEffect, useState, useRef } from "react";
import {
  createSignalRConnection,
  invokeSignalRMethod,
  startSignalRConnection,
} from "../utils/signalRUtils";
import { useParams } from "react-router-dom";

const LiveStreamPage = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { id } = useParams();
  const [connection, setConnection] = useState(null);
  //const [streamerConnId, setStreamerConnId] = useState(null);
  const peerConnectionRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    try {
      createSignalConn();
    } catch (error) {
      console.log("Error: ", error);
    }
  }, []);

  const createSignalConn = async () => {
    const signalRConnection = createSignalRConnection(BASE_URL, "live");

    signalRConnection.on("ReceiveOffer", (offer, connId) => {
      createPeer(JSON.parse(offer), connId, signalRConnection);
    });

    signalRConnection.on("ReceiveIceCandidate", (_, candidate) => {
      handleIceCandidate(JSON.parse(candidate));
    });

    //await startSignalRConnection(signalRConnection, setConnection);

    try {
      await signalRConnection.start();
      setConnection(signalRConnection);
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
  };

  const handleIceCandidate = async (candidate) => {
    console.log("Set ice candidate");
    await peerConnectionRef.current.addIceCandidate(
      new RTCIceCandidate(candidate)
    );
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
    </div>
  );
};

export default LiveStreamPage;

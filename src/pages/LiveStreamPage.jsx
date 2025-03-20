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
  const [streamerConnId, setStreamerConnId] = useState(null);
  const peerConnectionRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const connectToSignalR = async () => {
      const newConnection = createSignalRConnection(BASE_URL, "live");

      newConnection.on("ReceiveOffer", async (streamerId, offer) => {
        setStreamerConnId(streamerId);
        await makeCall(newConnection, streamerId, offer);
      });

      await startSignalRConnection(newConnection, setConnection);

      invokeSignalRMethod(newConnection, "WatchLiveStream", id);
    };

    connectToSignalR();
  }, []);

  const makeCall = async (newConnection, streamerId, offer) => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const newPeerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = newPeerConnection;
    console.log("Offer");

    newPeerConnection.setRemoteDescription(
      new RTCSessionDescription(JSON.parse(offer))
    );

    const answer = await newPeerConnection.createAnswer();
    await newPeerConnection.setLocalDescription(answer);
    newConnection.invoke("SendAnswer", streamerId, JSON.stringify(answer));

    // Ice candidate beállítása
    newConnection.on("ReceiveIceCandidate", async (candidate) => {
      if (peerConnectionRef.current && candidate) {
        console.log("Received ICE Candidate:", candidate);
        await peerConnectionRef.current.addIceCandidate(
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
          streamerId,
          JSON.stringify(event.candidate)
        );
      }
    });

    newPeerConnection.addEventListener("track", async (event) => {
      console.log("Track event");
      const [remoteStream] = event.streams;
      remoteVideoRef.current.srcObject = remoteStream;
    });

    newPeerConnection.addEventListener("icecandidateerror", (event) => {
      console.log(event);
    });
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

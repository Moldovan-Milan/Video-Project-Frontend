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

      newConnection.on("JoinedToLiveStream", async (streamerId) => {
        setStreamerConnId(streamerId);
        await makeCall(newConnection, streamerId);
      });

      await startSignalRConnection(newConnection, setConnection);

      invokeSignalRMethod(newConnection, "WatchLiveStream", id);
    };

    connectToSignalR();
  }, []);

  const makeCall = async (newConnection, streamerId) => {
    // Megkapott válasz beállítása
    newConnection.on("ReceiveAnswer", async (answer) => {
      console.log("Receiwe Answer");
      console.log(peerConnectionRef.current);
      await peerConnectionRef.current.setRemoteDescription(
        new RTCSessionDescription(JSON.parse(answer))
      );
    });

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

    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const newPeerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = newPeerConnection;

    // Ice candidate elküldése
    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        invokeSignalRMethod(
          newConnection,
          "SendIceCandidate",
          streamerId,
          JSON.stringify(event.candidate)
        );
      }
    };

    newPeerConnection.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    const offer = await newPeerConnection.createOffer();
    await newPeerConnection.setLocalDescription(offer);

    // Offer (ajánlat) elküdlése a kapcsolat kezdeményezéséhez
    invokeSignalRMethod(
      newConnection,
      "SendOffer",
      streamerId,
      JSON.stringify(offer)
    );
  };

  return (
    <div>
      <h2>Live Stream</h2>
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: "80%", border: "1px solid black" }}
      />
    </div>
  );
};

export default LiveStreamPage;

import { useParams } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";

const LiveStreamPage = () => {
    const { id } = useParams();
    const [liveStream, setLiveStream] = useState(null);
    const remoteVideoRef = useRef(null);

    useEffect(() => {
        const fetchLiveStream = async () => {
            try {
                const { data } = await axios.get(`/api/livestream/${id}`);
                setLiveStream(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchLiveStream();
    }, [id]);

    useEffect(() => {
        if (liveStream) {
            const startWebRTC = async () => {
                const peerConnection = new RTCPeerConnection();

                peerConnection.ontrack = event => {
                    remoteVideoRef.current.srcObject = event.streams[0];
                };

                // Assume signaling and ICE candidate exchange is already handled
                // Here we just set up the remote stream once the connection is established
                
                // For simplicity, we're not including the full signaling logic here
                // Add your signaling logic for WebRTC offer/answer and ICE candidate exchange

                // Example logic to add remote stream track
                const remoteStream = new MediaStream();
                peerConnection.addTrack(remoteStream.getVideoTracks()[0]);
            };

            startWebRTC();
        }
    }, [liveStream]);

    return (
        <div>
            {liveStream ? (
                <div>
                    <h1>{liveStream.streamTitle}</h1>
                    <p>{liveStream.description}</p>
                    <video ref={remoteVideoRef} id="remoteVideo" autoPlay></video>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default LiveStreamPage;

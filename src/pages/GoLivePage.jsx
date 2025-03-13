import React, { useRef, useState } from "react";
import { FaCamera, FaDesktop, FaPlay, FaStop } from "react-icons/fa";
import "../styles/GoLivePage.scss";
import axios from "axios";

const MediaSharing = () => {
  const videoRef = useRef(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [stream, setStream] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamURL, setStreamURL] = useState(null);

  const handleScreenSelected = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      setStream(screenStream);
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
      setSelectedSource("screen");

      // Handle stopping of screen sharing
      screenStream.getTracks()[0].onended = () => {
        stopSharing();
      };
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
    try{
        //TODO: send the stream through a websocket
        if(selectedSource && title){
            const token = sessionStorage.getItem("jwtToken")
            console.log(token);
            const response = await axios.post(
                `api/LiveStream/start?streamTitle=${title}&description=${description}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStreamURL(response.data.streamId);
            setIsStreaming(true)
            return
        }
        window.alert("Enter valid title, and select streaming method!");
    }
    catch(error){
        console.error(error)
    }
  }

  const stopSharing = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setSelectedSource(null);
      setStream(null);
      setIsStreaming(false);
    }
  };

  return (
    <div className="goLiveContainer">
      <h1>Media Sharing</h1>
      {!isStreaming &&(<>
        <label>Title: </label>
        <input type="text" onChange={(e) => setTitle(e.target.value)} value={title} className="text-black"/>
        <label>Description: </label>
        <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="text-black"/>
      </>)}
      <div>
        {!isStreaming &&(<>
            <button onClick={handleScreenSelected} className={selectedSource==="screen"?"selectedSourceBtn":"sourceBtn"}><FaDesktop className="m-1"/>Go live by sharing your screen </button>
            <button onClick={handleCameraSelected} className={selectedSource==="camera"?"selectedSourceBtn":"sourceBtn"}><FaCamera className="m-1"/>Go live with webcam </button>
            <button onClick={GoLive} className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mb-2 flex"><FaPlay className="m-1"/> Go Live</button>
        </>)}
        
        {isStreaming && (<button onClick={stopSharing} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-2 flex"><FaStop className="m-1"/>Stop Sharing </button>)}
      </div>
      {isStreaming && (<h2>Your stream code: {streamURL}</h2>)}
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
    </div>
  );
};

export default MediaSharing;
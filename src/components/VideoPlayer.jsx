import React, { useRef, useEffect, useState, useContext, } from "react";
import Hls from "hls.js";
import axios from "axios";
import "../styles/VideoPlayer.scss";
import { UserContext } from "./contexts/UserProvider";
import { useParams } from "react-router-dom";


const VideoPlayer = ({ src, id }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const watchThreshold = 10;
  const timerRef = useRef(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error(`HLS error: ${data.details}`);
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    } else {
      console.error("HLS is not supported in this browser.");
    }
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      console.log("Video started playing");
      setIsPlaying(true);
      startTimer();
    };

    const handlePause = () => {
      console.log("Video paused");
      setIsPlaying(false);
      stopTimer();
    };

    const handleEnded = () => {
      console.log("Video ended");
      setIsPlaying(false);
      stopTimer();
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const startTimer = () => {
    if (!timerRef.current) {
      timerRef.current = setInterval(() => {
        setWatchTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= watchThreshold) {
            //todo only send this once
            validateView();
            stopTimer();
          }
          return newTime;
        });
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  const params = useParams()
  const validateView = async () => {
    try {
        if(user){
          
          const response = await axios.post(`api/Video/add-video-view?videoId=${params.id}&userId=${user.id}`);
          console.log(response)
        }
        else{
          const response = await axios.post(`api/Video/add-video-view?videoId=${params.id}`);
          console.log(response);
        }
    } catch (error) {
      console.error("Error sending view to backend:", error);
    }
  };

  return (
    <>
      <video autoPlay ref={videoRef} controls style={{ width: "100%" }} />
      <p>Watch Time: {watchTime}s</p>
    </>
  );
};

export default VideoPlayer;

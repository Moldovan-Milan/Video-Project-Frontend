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
  const [watchThreshold, setWatchThreshold ] = useState(10);
  const timerRef = useRef(null);
  const { user } = useContext(UserContext);

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    console.log(video.duration)
    if (video) {
      const duration = video.duration
      if (duration <= 10) {
        setWatchThreshold(Math.floor(duration));
      } else {
        setWatchThreshold(10);
      }
    }
  };

  useEffect(() => {
    if(watchTime >= watchThreshold){
      validateView()
    }
  }, [watchTime])


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
      setIsPlaying(true);
      startTimer();
    };

    const handlePause = () => {
      setIsPlaying(false);
      stopTimer();
    };

    const handleEnded = () => {
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
        }
        else{
          const response = await axios.post(`api/Video/add-video-view?videoId=${params.id}`);
        }
    } catch (error) {
      console.error("Error sending view to backend:", error);
    }
  };

  return (
    <>
      <video autoPlay ref={videoRef} controls style={{ width: "100%" }} onLoadedMetadata={handleLoadedMetadata}/>
    </>
  );
};

export default VideoPlayer;

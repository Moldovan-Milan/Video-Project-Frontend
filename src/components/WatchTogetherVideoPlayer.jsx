import React, { useEffect, useRef, useState } from "react";
import { useWTSignalR } from "./contexts/WatchTogetherSingalRProvider";
import Hls from "hls.js";

const SYNC_TIME = 2000; // 2 sec

const WatchTogetherVideoPlayer = ({ roomId, videoUrl, isHost, isPlaying }) => {
  const videoRef = useRef(null);
  const connection = useWTSignalR();
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    if (connection) {
      connection.on("Play", (timestamp) => {
        if (videoRef.current && !isHost) {
          setIsSyncing(true);
          videoRef.current.currentTime = timestamp;
          videoRef.current.play();
          setTimeout(() => setIsSyncing(false), 500);
        }
      });

      connection.on("Pause", (timestamp) => {
        if (videoRef.current && !isHost) {
          setIsSyncing(true);
          videoRef.current.currentTime = timestamp;
          videoRef.current.pause();
          setTimeout(() => setIsSyncing(false), 500);
        }
      });

      connection.on("Seek", (timestamp) => {
        if (videoRef.current && !isHost) {
          setIsSyncing(true);
          videoRef.current.currentTime = timestamp;
          setTimeout(() => setIsSyncing(false), 500);
        }
      });

      connection.on("PlaybackRateChanged", (rate) => {
        if (videoRef.current && !isHost) {
          setIsSyncing(true);
          if (videoRef.current.playbackRate != rate) {
            videoRef.current.playbackRate = rate;
          }
          setTimeout(() => setIsSyncing(false), 500);
        }
      });

      return () => {
        connection.off("Play");
        connection.off("Pause");
        connection.off("Seek");
      };
    }
  }, [connection]);

  useEffect(() => {
    let sendCurrentVideoTime = null;
    if (isHost) {
      sendCurrentVideoTime = setInterval(() => {
        if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          const playbackRate = videoRef.current.playbackRate;
          connection
            .invoke("SyncTime", roomId, currentTime, playbackRate)
            .catch((err) => console.log("Failed to sync time: ", err));
        }
      }, SYNC_TIME);
    }

    return () => {
      if (sendCurrentVideoTime) {
        clearInterval(sendCurrentVideoTime);
      }
    };
  }, [isHost]);

  useEffect(() => {
    let hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error(`HLS error: ${data.details}`);
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = videoUrl;
    } else {
      console.error("HLS nem támogatott ebben a böngészőben.");
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [videoUrl]);

  const handlePlay = () => {
    if (connection && !isSyncing && isHost) {
      connection.invoke(
        "SyncVideoState",
        roomId,
        videoRef.current.currentTime,
        true
      );
    }
  };

  const handlePause = () => {
    if (connection && !isSyncing && isHost) {
      connection.invoke(
        "SyncVideoState",
        roomId,
        videoRef.current.currentTime,
        false
      );
    }
  };

  const handleSeek = () => {
    if (connection && !isSyncing && isHost) {
      connection.invoke(
        "SyncVideoState",
        roomId,
        videoRef.current.currentTime,
        !videoRef.current.paused
      );
    }
  };

  const handleEnd = () => {
    if (connection && isHost) {
      connection.invoke("NextVideo", roomId);
    }
  };

  const handelRateChange = () => {
    if (videoRef.current && isHost) {
      const playbackRate = videoRef.current.playbackRate;
      connection.invoke("PlaybackRateChanged", roomId, playbackRate);
    }
  };

  useEffect(() => {
    if (connection) {
      connection.on("HostTimeSync", (hostTime) => {
        if (!isHost && videoRef.current) {
          console.log("Syncing guest time with host");
          synchronizeGuestTime(hostTime, videoRef.current.currentTime);
        }
      });

      return () => {
        connection.off("HostTimeSync");
      };
    }
  }, [connection]);

  const synchronizeGuestTime = (hostTime, currentTime) => {
    let timeDifference = hostTime - currentTime;

    if (Math.abs(timeDifference) > 1) {
      videoRef.current.currentTime = hostTime;
      videoRef.current.playbackRate = 1;
      return;
    }

    // let correctionSpeed = timeDifference > 0 ? 1.05 : 0.95;
    // videoRef.current.playbackRate = correctionSpeed;

    // requestAnimationFrame(() =>
    //   synchronizeGuestTime(hostTime, videoRef.current.currentTime)
    // );
  };

  return (
    <div>
      <video
        ref={videoRef}
        controls={isHost}
        width="640"
        autoPlay={isPlaying || isHost}
        height="360"
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeek}
        onEnded={handleEnd}
        onRateChange={handelRateChange}
      ></video>
    </div>
  );
};

export default WatchTogetherVideoPlayer;

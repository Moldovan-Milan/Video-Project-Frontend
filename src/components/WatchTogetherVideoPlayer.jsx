import React, { useEffect, useRef, useState } from "react";
import { useWTSignalR } from "./contexts/WatchTogetherSingalRProvider";
import Hls from "hls.js";

const WatchTogetherVideoPlayer = ({ roomId, videoUrl }) => {
  const videoRef = useRef(null);
  const connection = useWTSignalR();
  const [isSyncing, setIsSyncing] = useState(false); // Ezt használjuk a ciklusok elkerülésére

  // Sync video state on first connection
  useEffect(() => {
    if (connection) {
      connection.on("SyncVideoState", (timestamp, isPlaying) => {
        if (videoRef.current) {
          videoRef.current.currentTime = timestamp;
          if (isPlaying) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        }
      });

      return () => {
        connection.off("SyncVideoState");
      };
    }
  }, [connection]);

  // Create methods for Hub events
  useEffect(() => {
    if (connection) {
      connection.on("ReceivePlay", (timestamp) => {
        if (videoRef.current) {
          setIsSyncing(true);
          videoRef.current.currentTime = timestamp;
          videoRef.current.play();
          setTimeout(() => setIsSyncing(false), 500);
        }
      });

      connection.on("ReceivePause", (timestamp) => {
        if (videoRef.current) {
          setIsSyncing(true);
          videoRef.current.currentTime = timestamp;
          videoRef.current.pause();
          setTimeout(() => setIsSyncing(false), 500);
        }
      });

      connection.on("ReceiveSeek", (timestamp) => {
        if (videoRef.current) {
          setIsSyncing(true);
          videoRef.current.currentTime = timestamp;
          setTimeout(() => setIsSyncing(false), 500);
        }
      });

      return () => {
        connection.off("ReceivePlay");
        connection.off("ReceivePause");
        connection.off("ReceiveSeek");
      };
    }
  }, [connection]);

  // Enable HLS for streaming
  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error(`HLS error: ${data.details}`);
      });

      return () => {
        hls.destroy();
      };
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // Natív HLS támogatás (pl. Safari)
      videoRef.current.src = videoUrl;
    } else {
      console.error("HLS nem támogatott ebben a böngészőben.");
    }
  }, [videoUrl]);

  const handlePlay = () => {
    if (connection && !isSyncing) {
      const timestamp = videoRef.current.currentTime;
      connection.invoke("Play", roomId, timestamp);
    }
  };

  const handlePause = () => {
    if (connection && !isSyncing) {
      const timestamp = videoRef.current.currentTime;
      connection.invoke("Pause", roomId, timestamp);
    }
  };

  const handleSeek = () => {
    if (connection && !isSyncing) {
      const timestamp = videoRef.current.currentTime;
      connection.invoke("Seek", roomId, timestamp);
    }
  };

  return (
    <div>
      <video
        ref={videoRef}
        width="640"
        height="360"
        controls
        onPlay={handlePlay}
        onPause={handlePause}
        onSeeked={handleSeek}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </div>
  );
};

export default WatchTogetherVideoPlayer;

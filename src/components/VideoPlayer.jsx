import React, { useRef, useEffect } from "react";
import Hls from "hls.js";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);

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
      // Natív HLS támogatás (pl. Safari)
      videoRef.current.src = src;
    } else {
      console.error("HLS nem támogatott ebben a böngészőben.");
    }
  }, [src]);

  return (
    <video
      ref={videoRef}
      //poster={`https://localhost:7124/api/video/thumbnail/${thumbnailId}`}
      controls
      style={{ width: "100%" }}
    />
  );
};

export default VideoPlayer;

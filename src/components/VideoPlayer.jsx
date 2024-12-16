import React, { useRef, useEffect, useState } from "react";
import Hls from "hls.js";
import axios from "axios";

const VideoPlayer = ({ src, id}) => {
  const videoRef = useRef(null);
  const [user, setUser] = useState(null)

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

  useEffect(() =>  {
       // User adatainak lekérése
       const fetchData = async () =>{
        console.log(id)
          const result = await (await axios.get(`api/video/data/${id}`))
          const {user} = result.data
          setUser(user)
          console.log(user.avatarId)
       }
       fetchData();
       
  }, [src])

  return (
    <>
    <video
      ref={videoRef}
      //poster={`https://localhost:7124/api/video/thumbnail/${thumbnailId}`}
      controls
      style={{ width: "100%" }}
    />
    {/* <img src={`https://localhost:7124/api/user/avatar/${user.avatarId}`} width="100" height="100"></img> */}
    </>
  );
};

export default VideoPlayer;

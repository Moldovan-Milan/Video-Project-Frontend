import React, { useEffect } from "react";
import WatchTogetherVideoPlayer from "./WatchTogetherVideoPlayer";

const VideoPlayerWrapper = ({
  isInRoom,
  currentVideo,
  isPlaying,
  isHost,
  id,
  connection,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    console.log(id);
  }, []);

  return (
    <div className="wt-video-wrapper">
      {isInRoom && currentVideo ? (
        <WatchTogetherVideoPlayer
          roomId={id}
          isPlaying={isPlaying}
          isHost={isHost}
          videoUrl={`${BASE_URL}/api/video/${currentVideo.id}`}
          connection={connection}
        />
      ) : !isHost ? (
        <div>
          Waiting... If the host doesn't respond soon, we might miss the
          premiere! 😬
        </div>
      ) : (
        <div>
          Uh-oh! Looks like we forgot to pick a video... 📽️
          <br />
          Go ahead and choose one from the search – we’re all waiting! ⏳
        </div>
      )}
    </div>
  );
};

export default VideoPlayerWrapper;

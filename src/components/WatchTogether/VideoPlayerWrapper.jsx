import React, { useEffect } from "react";
import WatchTogetherVideoPlayer from "./WatchTogetherVideoPlayer";

const VideoPlayerWrapper = ({
  isInRoom,
  currentVideo,
  isPlaying,
  isHost,
  id,
  connection,
  loading,
}) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;

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
          videoUrl={`${CLOUDFLARE_PATH}/videos/${currentVideo.path}/${currentVideo.path}.m3u8`}
          connection={connection}
        />
      ) : !isHost ? (
        loading ? (
          <div>
            🚀 Hold on tight, we're powering up WatchTogether! ⚙️🔧
            <br />
            We are working behind the scenes to make sure everything runs
            smoothly. 🧝‍♂️💻
            <br />
            In the meantime, grab some popcorn and pretend this is an intense
            movie buildup! 🍿🎬
          </div>
        ) : (
          <div>
            Waiting... If the host doesn't respond soon, we might miss the
            premiere! 😬
          </div>
        )
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

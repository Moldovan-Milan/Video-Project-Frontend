import React from "react";
import WatchTogetherVideoPlayer from "./WatchTogetherVideoPlayer";

const VideoPlayerWrapper = ({
  isInRoom,
  currentVideo,
  isPlaying,
  isHost,
  id,
}) => {
  return (
    <div className="wt-video-wrapper">
      {isInRoom && currentVideo ? (
        <WatchTogetherVideoPlayer
          roomId={id}
          isPlaying={isPlaying}
          isHost={isHost}
          videoUrl={`https://localhost:7124/api/video/${currentVideo.id}`}
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

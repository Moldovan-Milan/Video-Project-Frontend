import React from "react";
import PropTypes from "prop-types";
//import "../styles/Playlist.scss";

const Playlist = ({
  playList,
  currentVideo,
  isHost,
  startVideo,
  deleteVideo,
}) => {
  return (
    <div className="wt-playlist">
      <h3>{isHost ? "Playlist" : "Next Videos"}</h3>
      <ul>
        {playList.map((video) => (
          <li
            onClick={() => startVideo(video)}
            key={video.id}
            className={currentVideo?.id === video.id ? "selected" : ""}
          >
            <div>
              <img
                src={`https://localhost:7124/api/video/thumbnail/${video.thumbnailId}`}
                alt={video.title}
                className="wt-thumbnail"
              />
            </div>
            <span>{video.title}</span>

            {/* Törlés ikon csak admin esetén */}
            {isHost && currentVideo?.id !== video.id && (
              <span
                className="delete-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteVideo(video.id);
                }}
              >
                🗑️
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

Playlist.propTypes = {
  playList: PropTypes.array.isRequired,
  currentVideo: PropTypes.object,
  isHost: PropTypes.bool.isRequired,
  startVideo: PropTypes.func.isRequired,
  deleteVideo: PropTypes.func.isRequired,
};

export default Playlist;

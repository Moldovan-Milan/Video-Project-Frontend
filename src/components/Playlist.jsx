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
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

  return (
    <div className="wt-playlist">
      <h3>{isHost ? "Playlist" : "Next Videos"}</h3>
      <ul>
        {playList.map((video) => (
          <li
            onClick={() => (isHost ? startVideo(video) : null)}
            key={video.id}
            className={currentVideo?.id === video.id ? "selected" : ""}
          >
            <div>
              <img
                src={`${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}`}
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

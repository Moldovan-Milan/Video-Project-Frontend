import React from "react";
import { FaClock } from "react-icons/fa";
import "../styles/WatchTogetherVideoItem.scss";
import formatDuration from "../functions/formatDuration";

const WatchTogetherVideoItem = ({ video, onSelect }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

  return (
    <div className="W2GVidItem" onClick={() => onSelect(video)}>
      <div className="W2GVidItemTumbnailCol">
        <div
          style={{
            backgroundImage: `url("${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}")`,
          }}
          className="W2GVidItemThumbnailDiv">
            <div className="W2GVidDuration flex">
              <FaClock className="W2GClock" />
              {formatDuration(video.duration)}
            </div>
        </div>
      </div>
      <div className="W2GVidItemDetailsCol">
          <div className="W2GItemDetailsRows">
              <div className="VidItemTitleWrapper">
                <h3 className="W2GVidItemTitle">{video.title}</h3>
              </div>
              <div>
              <p className="W2GVidItemDescription">{video.description}</p>
              </div>
              <div className="W2GVidItemUser">
                <img
                  loading="eager"
                  src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${video.user.avatar.path}.${video.user.avatar.extension}`}
                  alt={video.user.userName}
                  className="W2GVidItemAvatar"
                />
                <span className="W2GVidUsername">{video.user.userName}</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default WatchTogetherVideoItem;

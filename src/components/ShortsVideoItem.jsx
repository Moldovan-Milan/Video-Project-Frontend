import "../styles/ShortsVideoItem.scss";
import React, { forwardRef } from "react";
import "../styles/VideoItem.scss";
import { Link } from "react-router-dom";
import formatDuration from "../functions/formatDuration";

const ShortsVideoItem = forwardRef(({ video }, ref) => {
  const { id, title, duration, created, thumbnailId, user, views } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

  return (
    <div
      ref={ref}
      className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
      title={title}
    >
      <Link to={`/video/${id}`}>
        <div
          style={{
            backgroundImage: `url("${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}")`,
          }}
          className="shortsItemThumbnail"
        >
          <div className="shortsItemTitle" title={user.userName}>
            <object>
              <Link to={`/profile/${video.user.id}`} onClick={(e) => e.stopPropagation()}>
                <img
                  src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${video.user.avatar.path}.${video.user.avatar.extension}`}
                  className="shortsAvatar"
                ></img>
              </Link>
            </object>
            <p>{title}</p>
            <p>{formatDuration(duration)}</p>
          </div>
        </div>
      </Link>
    </div>
  );
});

export default ShortsVideoItem;

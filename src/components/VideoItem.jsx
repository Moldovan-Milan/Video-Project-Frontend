import React, { forwardRef } from "react";
import "../styles/VideoItem.scss";
import { Link } from "react-router-dom";
import timeAgo from "../functions/timeAgo";
import formatDuration from "../functions/formatDuration";
import getViewText from "../functions/getViewText";
import { FaEye } from "react-icons/fa";

const VideoItem = forwardRef(({ video }, ref) => {
  const { id, title, duration, created, thumbnailId, user, views } = video;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

  return (
    <div
      ref={ref}
      className="w-full lg:w-1/4 p-2 VidItemOuter"
      title={title}
    >
      <div className="shadow-md rounded-lg overflow-hidden border-animacio">
        <div className="video-item">
          <Link to={`/video/${id}`}>
            <div
              style={{
                backgroundImage: `url("${CLOUDFLARE_PATH}/${THUMBNAIL_PATH}/${video.thumbnail.path}.${video.thumbnail.extension}")`,
              }}
              className="thumbnail-div"
            >
              <div className="video-duration">{formatDuration(duration)}</div>
            </div>
            <div className="p-4 VideoItemDetails">
              <div className="VidItemCol1" title={user.userName}>
                <object>
                  <Link to={`/profile/${video.user.id}`} onClick={(e) => e.stopPropagation()}>
                    <img
                      src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${video.user.avatar.path}.${video.user.avatar.extension}`}
                      className="VidItemUploaderAvt w-12 h-12"
                      alt="Uploader Avatar"/>
                  </Link>
                </object>
              </div>
              <div className="VidItemCol2">
                <div className="VidItemDetailsRows">
                <div className="VidItemTitleWrapper">
                  <p className="VidItemTitle font-bold">{title}</p>
                </div>
                <div className="text-2xl VidItemUploader" title={user.userName}>
                  <object>
                    <Link to={`/profile/${video.user.id}`} onClick={(e) => e.stopPropagation()}>
                      {user.userName}
                    </Link>
                  </object>
                </div>                    
                <div className="text-sm VidItemViews">
                  <FaEye className="m-1 eye-icon"/>
                  {getViewText(views)} ● Created: {timeAgo(new Date(created))}
                </div>
                </div>
              </div>        
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default VideoItem;

import "../styles/ShortsVideoItem.scss";
import React, { forwardRef } from "react";
import "../styles/VideoItem.scss";
import { Link } from "react-router-dom";
import formatDuration from "../functions/formatDuration";

const ShortsVideoItem= forwardRef(({ video }, ref) => {
    const { id, title, duration, created, thumbnailId, user, views } = video;
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    return(
        <div  ref={ref} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2" title={title}>
        <Link to={`/video/${id}`}>
        <div style={{backgroundImage:`url("${BASE_URL}/api/Video/thumbnail/${thumbnailId}")`}} className="shortsItemThumbnail">
        <div className="shortsItemTitle">
            <img src={`${BASE_URL}/api/User/avatar/${user.avatarId}`} className="shortsAvatar"></img>
            <p>{title}</p>
            <p>{formatDuration(duration)}</p>
            </div>
        </div>
        </Link>
        </div>
    )
});

export default ShortsVideoItem;
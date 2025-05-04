import React from "react";
import { FaSearch } from "react-icons/fa";
import WatchTogetherVideoItem from "../WatchTogether/WatchTogetherVideoItem";
import "../../styles/WatchTogether/WatchTogetherRoom.scss";

const VideoSearch = ({
  searchRef,
  handleSearch,
  searchMessage,
  videos,
  playList,
  onVideoSelect,
}) => {
  return (
    <div className="wt-search-section">
      <div className="wt-search-bar">
        <input
          className="wt-search-input"
          type="search"
          placeholder="Search"
          aria-label="Search"
          ref={searchRef}
        />
        <button onClick={handleSearch} className="wt-wtsearch-btn">
          <FaSearch />
        </button>
      </div>
      <div className="wt-video-results">
        {searchMessage && (
          <div className="wt-search-message">{searchMessage}</div>
        )}
        {videos.map(
          (video) =>
            !playList.some((v) => v.id === video.id) && (
              <WatchTogetherVideoItem
                onSelect={onVideoSelect}
                video={video}
                key={video.id}
              />
            )
        )}
      </div>
    </div>
  );
};

export default VideoSearch;

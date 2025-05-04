import React, { useState, useRef, useCallback } from "react";
import RecVideoItem from "./RecVideoItem";

export default function RecommendedVideos({ data }) {
  const pageSize = 30
  const [displayedVideos, setDisplayedVideos] = useState(data.slice(0, pageSize));
  const [page, setPage] = useState(1);
  const observer = useRef();

  const lastVideoRef = useCallback(
    (node) => {
      if (!node || displayedVideos.length >= data.length) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => {
            const nextVideos = data.slice(0, (prevPage + 1) * 10);
            setDisplayedVideos(nextVideos);
            return prevPage + 1;
          });
        }
      });

      observer.current.observe(node);
    },
    [data, displayedVideos.length]
  );

  return (
    <div>
      {displayedVideos.map((video, index) => {
        const isLastVideo = index === displayedVideos.length - 1;
        return (
          <RecVideoItem 
            key={video.id} 
            video={video} 
            ref={isLastVideo ? lastVideoRef : null} 
          />
        );
      })}
    </div>
  );
}

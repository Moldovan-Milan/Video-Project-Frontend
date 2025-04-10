import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
const VideoItem = React.lazy(() => import("../components/VideoItem")); // Lazy import

import loading from "../assets/loading.gif";

const VideosPage = () => {
  const [videos, setVideos] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 30;
  const observerRef = useRef(null);

  useEffect(() => {
    document.title = "Omega Stream";

    const fetchVideos = async () => {
      try {
        const response = await axios.get(
          `api/video?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
        const { videos: newVideos, hasMore } = response.data;

        setVideos((prevVideos) => {
          const filteredNewVideos = newVideos.filter(
            (newVideo) => !prevVideos.some((video) => video.id === newVideo.id)
          );
          return [...prevVideos, ...filteredNewVideos];
        });
        setHasMore(hasMore);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [pageNumber]);

  const lastVideoRef = useCallback(
    (node) => {
      if (!hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore]
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center -mx-2">
        {videos.length > 0 ? (
          videos.map((video, index) => {
            const isLastVideo = index === videos.length - 1;
            return (
              <Suspense key={video.id} fallback={<div>Loading...</div>}>
                <VideoItem
                  video={video}
                  ref={isLastVideo ? lastVideoRef : null}
                />
              </Suspense>
            );
          })
        ) : (
          <img src={loading} alt="loading" />
        )}
      </div>
    </div>
  );
};

export default VideosPage;

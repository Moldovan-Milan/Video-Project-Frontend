import axios from "axios";
import React, { useEffect, useState, useRef, useCallback } from "react";
import loading from "../assets/loading.gif";
import ShortsVideoItem from "../components/ShortsVideoItem";
import "../styles/ShortsPage.scss";

const ShortsPage = () => {
  const [shorts, setShorts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 30;
  const [pageNumber, setPageNumber] = useState(1);
  const observerRef = useRef(null);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const response = await axios.get(
          `api/video/shorts?pageSize=${pageSize}&pageNumber=${pageNumber}`
        );
        const { shorts: newShorts, hasMore } = response.data;

        setShorts((prevShorts) => {
          const filteredNewShorts = newShorts.filter(
            (newShort) => !prevShorts.some((short) => short.id === newShort.id)
          );
          return [...prevShorts, ...filteredNewShorts];
        });

        setHasMore(hasMore);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchShorts();
  }, [pageNumber]);

  const lastShortRef = useCallback(
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
    <>
    <h1 className="shortsTitle">Shorts</h1>
    <hr></hr>
      <div className="flex flex-wrap flex-row">
      {shorts.length > 0 ? (
        shorts.map((video, index) => {
          const isLastShort = index === shorts.length - 1;
          return (
            <>
              <ShortsVideoItem video={video} key={video.id} ref={isLastShort ? lastShortRef : null}/>
              </>
          );
        })
      ) : (
        <img src={loading} alt="loading" />
      )}
    </div>
    </>
  );
};

export default ShortsPage;

import React, { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { UserContext } from '../components/contexts/UserProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WatchHistoryVideoItem from '../components/WatchHistoryVideoItem';

const ViewHistoryPage = () => {
    const [videoViews, setVideoViews] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [pageSize] = useState(30);
    const [pageNumber, setPageNumber] = useState(1);
    const observerRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        document.title = `Watch history | Omega Stream`;

        const fetchVideoViews = async () => {
            try {
                const response = await axios.get(`api/Video/watch-history?pageSize=${pageSize}&pageNumber=${pageNumber}`, {
                    withCredentials: true
                });

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                const { videoViews: newVideos, hasMore } = response.data;

                setVideoViews((prevVideoViews) => [...prevVideoViews, ...newVideos]);
                setHasMore(hasMore);
            } catch (error) {
                console.log(error);
            }
        };

        fetchVideoViews();
    }, [user, navigate, pageSize, pageNumber]);

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
        <div>
            {videoViews.length > 0 ? (
                videoViews.map((videoView, index) => {
                    if (index === videoViews.length - 1) {
                        return (
                            <div ref={lastVideoRef} key={videoView.videoId}>
                                <WatchHistoryVideoItem videoView={videoView} />
                            </div>);
                    }
                    return <WatchHistoryVideoItem key={videoView.videoId} videoView={videoView} />;
                })
            ) : (
                <p>No videos in history.</p>
            )}
        </div>
    );
};

export default ViewHistoryPage;

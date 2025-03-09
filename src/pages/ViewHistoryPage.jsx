import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/contexts/UserProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WatchHistoryVideoItem from '../components/WatchHistoryVideoItem';

const ViewHistoryPage = () => {
    const [videoViews, setVideoViews] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [pageSize, setPageSize] = useState(30);
    const [pageNumber, setPageNumber] = useState(1);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        document.title = `Watch history | Omega Stream`;

        const fetchVideoViews = async () => {
            try {
                const token = sessionStorage.getItem("jwtToken");
                const response = await axios.get(`api/Video/watch-history/${user.id}?pageSize=${pageSize}&pageNumber=${pageNumber}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                const { videoViews, hasMore } = response.data;

                setVideoViews((prevVideoViews) => [...prevVideoViews, ...videoViews]);
                setHasMore(hasMore); 
            } catch (error) {
                console.log(error);
            }
        };

        fetchVideoViews();
    }, [user, navigate, pageSize, pageNumber]);

    const handleNextVideoPage = () => { 
        setPageNumber((prevPageNumber) => prevPageNumber + 1);
    };

    return (
        <div>
            {videoViews.length > 0 ? (
                videoViews.map((videoView) => (
                    <WatchHistoryVideoItem key={videoView.videoId} videoView={videoView} />
                ))
            ) : (
                <p>No videos in history.</p>
            )}
            
            {hasMore && videoViews.length > 0 && (
                <button onClick={handleNextVideoPage}>Load more videos</button>
            )}
        </div>
    );
};

export default ViewHistoryPage;

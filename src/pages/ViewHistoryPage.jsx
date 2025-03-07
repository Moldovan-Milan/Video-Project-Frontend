import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/contexts/UserProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WatchHistoryVideoItem from '../components/WatchHistoryVideoItem';

const ViewHistoryPage = () => {
    const [videoViews, setVideoViews] = useState([]);
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        
        document.title = `Watch history | Omega Stream`;

        const fetchVideoViews = async () => {
            try {
                const token = sessionStorage.getItem("jwtToken");
                const response = await axios.get(`api/Video/watch-history/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.status === 401) {
                    navigate("/");
                    return;
                }

                console.log(response.data);
                setVideoViews(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchVideoViews();
    }, [user, navigate]);

    return (
        <div>
            {videoViews.length > 0 ? (
                videoViews.map((videoView) => (
                    <WatchHistoryVideoItem key={videoView.video.id} videoView={videoView} />
                ))
            ) : (
                <p>No videos in history.</p>
            )}
        </div>
    );
};

export default ViewHistoryPage;

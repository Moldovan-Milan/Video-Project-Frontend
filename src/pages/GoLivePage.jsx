import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const GoLivePage = () => {
    const [streamTitle, setStreamTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = sessionStorage.getItem("jwtToken");
            const { data } = await axios.post("/api/livestream/start", {
                streamTitle,
                description,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            navigate(`/livestream/${data.streamId}`);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <h1>Go Live</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit">Start Live Stream</button>
            </form>
        </div>
    );
};

export default GoLivePage;

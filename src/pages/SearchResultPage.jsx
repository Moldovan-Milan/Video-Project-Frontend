import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import SearchVideoItem from "../components/Search/SearchVideoItem";
import SearchUserItem from "../components/Search/SearchUserItem";
import "../styles/Search/SearchResultPage.scss";
import dancing_squidward from "../assets/dancing_squidward.gif";

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("key");
  const navigate = useNavigate();

  const [filteredVids, setFilteredVids] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [switcher, setSwitcher] = useState("Videos");

  const [videoPage, setVideoPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [userPageSize] = useState(30);
  const [videoPageSize] = useState(30);

  const observer = useRef();

  useEffect(() => {
    if (!query) navigate("/");
  }, []);

  useEffect(() => {
    document.title = `Search results | ${query}`;
    setFilteredVids([]);
    setFilteredUsers([]);
    setVideoPage(1);
    setUserPage(1);
    setHasMoreVideos(true);
    setHasMoreUsers(true);
    fetchFilteredVids(1);
    fetchFilteredUsers(1);
  }, [query]);

  const fetchFilteredVids = async (page) => {
    if (!hasMoreVideos || loading) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `api/Video/search/${query}?pageNumber=${page}&pageSize=${videoPageSize}`
      );
      setFilteredVids((prev) => [...prev, ...data.videos]);
      setHasMoreVideos(data.videos.length > 0);
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
    setLoading(false);
  };

  const fetchFilteredUsers = async (page) => {
    if (!hasMoreUsers || loading) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `api/User/search/${query}?pageNumber=${page}&pageSize=${userPageSize}`
      );
      setFilteredUsers((prev) => [...prev, ...data.users]);
      setHasMoreUsers(data.users.length > 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (switcher === "Videos") {
              setVideoPage((prev) => prev + 1);
              fetchFilteredVids(videoPage + 1);
            } else {
              setUserPage((prev) => prev + 1);
              fetchFilteredUsers(userPage + 1);
            }
          }
        },
        { threshold: 1.0 }
      );
      if (node) observer.current.observe(node);
    },
    [loading, switcher]
  );

  return (
    <div>
      <h1>Showing results for: {query}</h1>
      <div className="divBottomPanelSwitch">
        <button
          className={
            switcher === "Videos"
              ? "btnBottomPanelActive"
              : "btnSwitchBottomPanel"
          }
          onClick={() => setSwitcher("Videos")}
        >
          Videos
        </button>
        <button
          className={
            switcher === "Channels"
              ? "btnBottomPanelActive"
              : "btnSwitchBottomPanel"
          }
          onClick={() => setSwitcher("Channels")}
        >
          Channels
        </button>
      </div>
      <div className="results-container">
        {switcher === "Videos" ? (
          <div>
            {filteredVids.length > 0 ? (
              filteredVids.map((video, index) =>
                index === filteredVids.length - 1 ? (
                  <SearchVideoItem
                    ref={lastElementRef}
                    key={video.id}
                    video={video}
                  />
                ) : (
                  <SearchVideoItem key={video.id} video={video} />
                )
              )
            ) : (
              <div>
                <p className="notFoundText">
                  There are no videos found for this search input, but here is
                  Squidward dancing 😎
                </p>{" "}
                <img className="squidwardImage" src={dancing_squidward} />
              </div>
            )}
          </div>
        ) : (
          <div>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) =>
                index === filteredUsers.length - 1 ? (
                  <SearchUserItem
                    ref={lastElementRef}
                    key={user.id}
                    user={user}
                  />
                ) : (
                  <SearchUserItem key={user.id} user={user} />
                )
              )
            ) : (
              <div>
                <p className="notFoundText">
                  There are no users found for this search input, but here is
                  Squidward dancing 😎
                </p>{" "}
                <img className="squidwardImage" src={dancing_squidward} />
              </div>
            )}
          </div>
        )}
      </div>
      {loading && <p>Loading more...</p>}
    </div>
  );
};

export default SearchResultPage;

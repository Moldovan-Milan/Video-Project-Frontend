import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import SearchVideoItem from '../components/SearchVideoItem';
import "../styles/SearchResultPage.scss";
import SearchUserItem from '../components/SearchUserItem';

const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("key");
  const navigate=useNavigate();
  const [filteredVids, setFilteredVids] = useState([]);
  const [filteredUsers,setFilteredUsers]=useState([]);
  const[switcher,setSwitcher]=useState("Videos");

  const fetchfilteredVids = async () => {
    const { data } = await axios.get(`api/Video/search/${query}`);
    setFilteredVids(data);
  };

  const fetchfilteredUsers = async () => {
    const { data } = await axios.get(`api/User/search/${query}`);
    setFilteredUsers(data);
  };

  useEffect(()=>{
  if(!query)
  {
      navigate("/")
  }
  },[])

  useEffect(()=>{
    document.title = `Search results | ${query}`;
  fetchfilteredVids();
  fetchfilteredUsers();
  },[query])
      

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
      {switcher === "Videos" ? (
          filteredVids && filteredVids.map((video, id) => <SearchVideoItem key={id} video={video} />)
        ) : (
          filteredUsers && filteredUsers.map((user, id) => <SearchUserItem key={id} user={user} />)

        )}
      
    </div>
  );
};

export default SearchResultPage;
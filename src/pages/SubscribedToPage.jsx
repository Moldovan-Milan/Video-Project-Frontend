import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import "../styles/SubscribedToPage.scss";
import { UserContext } from "../components/contexts/UserProvider";
import FollowedChannelItem from "../components/FollowedChannelItem";
import FollowingPageVideoItem from "../components/FollowingPageVideoItem";

export default function SubscribedToPage()
{
    const { user, setUser } = useContext(UserContext);
    const [userFollowed,setUserFollowed]=useState([]);

    const fetchUserFollowedUsers = async () => {
        const token = sessionStorage.getItem("jwtToken");
        const { data } = await axios.get(`api/User/${user.id}/following`, {
          headers: { Authorization: `Bearer ${token}` }});
        setUserFollowed(data.users);
      };

      useEffect(()=>{
        fetchUserFollowedUsers()
      },[])
    
    return(
      <>
      <div className="subList">
      {userFollowed.map((u, id) => (
        <FollowedChannelItem key={id} user={u}/>
      ))}     
    </div>
    <h2 className="subVideosTitle">Latest uploads by your favourites</h2>
    <div>
      {userFollowed.map((u,id)=>
        <div key={id}>
        <p className="followingUploadedText">Latest videos by {u.userName}</p>
        <hr></hr>
        {u.videos.map((video,v_id)=><FollowingPageVideoItem key={v_id} video={video}></FollowingPageVideoItem>)}
        </div>
      )}
    </div>
    </>
    )
}
import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import "../styles/SubscribedToPage.scss";
import { UserContext } from "../components/contexts/UserProvider";
import FollowedChannelItem from "../components/FollowedChannelItem";
import FollowingPageVideoItem from "../components/FollowingPageVideoItem";

export default function SubscribedToPage()
{
  //TODO: Pagination
    const { user, setUser } = useContext(UserContext);
    const [followedUsers,setFollowedUsers]=useState([]);

    const fetchFollowedUsers = async () => {
        const token = sessionStorage.getItem("jwtToken");
        const { data } = await axios.get(`api/User/${user.id}/following`, {
          headers: { Authorization: `Bearer ${token}` }});
        setFollowedUsers(data.users);
      };

      useEffect(()=>{
        fetchFollowedUsers()
      },[])
    
    return(
      <>
      <div className="subList">
      {followedUsers.map((u, id) => (
        <FollowedChannelItem key={id} user={u}/>
      ))}     
    </div>
    <h2 className="subVideosTitle">Recent Uploads from Your Favorite Channels</h2>
    <div>
      {followedUsers.map((u,id)=>
        <div key={id}>
        <p className="followingUploadedText">Latest videos by {u.userName}</p>
        <hr></hr>
        {u.videos.map((video,vId)=><FollowingPageVideoItem key={vId} video={video}></FollowingPageVideoItem>)}
        </div>
      )}
    </div>
    </>
    )
}
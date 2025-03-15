import UserAccVideoItem from "./UserAccVideoItem";

export default function UserAccountVideosPanel({videos})
{
    return(
        <>
        {videos.map((video,id)=><UserAccVideoItem key={id} video={video}/>)}
        </>
    )
}
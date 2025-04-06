import UserAccVideoItem from "./UserAccVideoItem";

export default function UserAccountVideosPanel({videos,styles})
{
    return(
        <>
        {videos.map((video,id)=><UserAccVideoItem key={id} video={video} color={styles?styles.secondaryColor:null}/>)}
        </>
    )
}
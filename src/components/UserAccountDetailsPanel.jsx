import ImageEditor from "./ImageEditor";
import "../styles/UserAccountDetailsPanel.scss";

export default function UserAccountDetailsPanel({user})
{
    return(
        <div className="DivDetailsPanel">
            <h2>Account datails</h2>
            <hr className="AccLine"></hr>
        <div className="DivAccDetails">
        <label>Channel name: </label>
        <p className="AccInfo">{user.username}</p>
        </div>
        <div className="DivAccDetails">
        <label>Email address: </label>
        <p className="AccInfo">{user.email}</p>
        </div>
        <div className="DivAccDetails">
        <label>Created at: </label>
        <p className="AccInfo">{user.created}</p>
        </div>
        <hr className="AccLine"></hr>
        <div>
        <h2>Edit your avatar</h2>
        <ImageEditor img={user.avatar}/>
        </div>
        </div>
    )
}
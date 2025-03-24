import { FaUserPlus } from "react-icons/fa";
import "../styles/UserAccountHeader.scss";
import banner from "../assets/teszt_banner.png";

export default function UserAccountHeader({user})
{
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    return(
    <>
    {/* {<img src={`${BASE_URL}/api/user/banner/${user.userTheme.bannerId}`} className="UserAccBanner"></img>} */}
    <img src={user.avatar} className="UserAccAvatar"/>
    <h1 className="UserAccUsername text-center">{user.username}</h1>
    <div className="subscribersLabel UserAccSubs">
    <FaUserPlus className="m-1"/><p>Your subscribers: {user.followers}</p>
    </div>
    </>)
}
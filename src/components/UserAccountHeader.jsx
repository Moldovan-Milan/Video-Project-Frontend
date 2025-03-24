import { FaUserPlus } from "react-icons/fa";
import "../styles/UserAccountHeader.scss";
import banner from "../assets/default_banner.png";
import { useEffect, useState } from "react";

export default function UserAccountHeader({ user }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    try {
      if (user.userTheme.bannerId) {
        setBannerUrl(`${BASE_URL}/api/user/banner/${user.userTheme.bannerId}`);
      } else {
        setBannerUrl(banner);
      }
    } catch {
      setBannerUrl(banner);
    }
  }, []);

  return (
    <>
      <img src={bannerUrl} className="UserAccBanner"></img>

      <img src={user.avatar} className="UserAccAvatar" />
      <h1 className="UserAccUsername text-center">{user.username}</h1>
      <div className="subscribersLabel UserAccSubs">
        <FaUserPlus className="m-1" />
        <p>Your subscribers: {user.followers}</p>
      </div>
    </>
  );
}

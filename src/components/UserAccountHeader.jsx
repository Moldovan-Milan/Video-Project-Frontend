import { FaUserPlus } from "react-icons/fa";
import "../styles/UserAccountHeader.scss";
import banner from "../assets/default_banner.png";
import { useEffect, useState } from "react";

export default function UserAccountHeader({ user }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [bannerUrl, setBannerUrl] = useState(null);
  const [isDefault, setIsDefult] = useState(null);

  useEffect(() => {
    try {
      //console.log(user);
      if (user.userTheme.bannerId) {
        //console.log("Bannnerrrr");
        setBannerUrl(`${BASE_URL}/api/user/banner/${user.userTheme.bannerId}`);
        setIsDefult(false);
      } else {
        setBannerUrl(banner);
        setIsDefult(true);
      }
    } catch {
      setBannerUrl(banner);
      setIsDefult(true);
    }
  }, [user]);

  return (
    <>
      <img
        src={bannerUrl}
        className={!isDefault ? "UserAccBanner" : "defualt-banner"}
      />

      <img src={user.avatar} className="UserAccAvatar" />
      <h1 className="UserAccUsername text-center">{user.username}</h1>
      <div className="subscribersLabel UserAccSubs">
        <FaUserPlus className="m-1" />
        <p>Your subscribers: {user.followers}</p>
      </div>
    </>
  );
}

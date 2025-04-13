import { FaUserPlus } from "react-icons/fa";
import "../styles/UserAccountHeader.scss";
import banner from "../assets/default_banner.png";
import { useEffect, useState } from "react";

export default function UserAccountHeader({ user }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [bannerUrl, setBannerUrl] = useState(null);
  const [isDefault, setIsDefult] = useState(null);
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const THUMBNAIL_PATH = import.meta.env.VITE_THUMBNAIL_PATH;

  useEffect(() => {
    try {
      if (user.userTheme.bannerId) {
        setBannerUrl(`${BASE_URL}/api/user/banner/${user.userTheme.bannerId}`);
        setIsDefult(false);
      } else {
        console.log("Banner default");
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
        className={!isDefault ? "UserAccBanner" : "default-banner"}
      />

      <img src={user.avatar} className="UserAccAvatar" style={user.userTheme&&user.userTheme.background?{borderColor:user.userTheme.background}:null}/>
      <h1 className="UserAccUsername text-center" style={
        user.userTheme&&user.userTheme.primaryColor
          ? {
              color: user.userTheme.primaryColor,
            }
          : null
      }>{user.username}</h1>
      <div className="subscribersLabel UserAccSubs" style={
        user.userTheme&&user.userTheme.primaryColor
          ? {
             backgroundColor: user.userTheme.primaryColor,
            }
          : null
      }>
        <FaUserPlus className="m-1" />
        <p>Subscribers: {user.followers}</p>
      </div>
    </>
  );
}

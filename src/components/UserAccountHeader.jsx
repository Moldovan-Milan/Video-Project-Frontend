import { FaUserPlus } from "react-icons/fa";
import "../styles/UserAccountHeader.scss";
import banner from "../assets/default_banner.png";
import { useEffect, useState } from "react";

export default function UserAccountHeader({ user }) {
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const BANNER_PATH = import.meta.env.VITE_BANNER_PATH;
  const [bannerUrl, setBannerUrl] = useState(null);
  const [isDefault, setIsDefult] = useState(null);

  useEffect(() => {
    console.log(user);
    try {
      if (user.userTheme.bannerId) {
        setBannerUrl(
          `${CLOUDFLARE_PATH}/${BANNER_PATH}/${user.userTheme.bannerImg.path}.${user.userTheme.bannerImg.extension}`
        );
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

      <img
        src={user.avatar}
        className="UserAccAvatar"
        style={
          user.userTheme && user.userTheme.background
            ? { borderColor: user.userTheme.background }
            : null
        }
      />
      <h1
        className="UserAccUsername text-center"
        style={
          user.userTheme && user.userTheme.primaryColor
            ? {
                color: user.userTheme.primaryColor,
              }
            : null
        }
      >
        {user.username}
      </h1>
      <div
        className="subscribersLabel UserAccSubs"
        style={
          user.userTheme && user.userTheme.primaryColor
            ? {
                backgroundColor: user.userTheme.primaryColor,
              }
            : null
        }
      >
        <FaUserPlus className="m-1" />
        <p>Subscribers: {user.followers}</p>
      </div>
    </>
  );
}

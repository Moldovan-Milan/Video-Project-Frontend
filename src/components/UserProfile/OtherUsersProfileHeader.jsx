import { FaUserPlus } from "react-icons/fa";
import "../../styles/UserProfile/OtherUsersProfileHeader.scss";
import banner from "../../assets/default_banner.png";
import { useEffect, useState } from "react";

export default function OtherUsersProfileHeader({ userData }) {
  const CLOUDFLARE_PATH = import.meta.env.VITE_PUBLIC_CLOUDFLARE_URL;
  const AVATAR_PATH = import.meta.env.VITE_AVATAR_PATH;
  const BANNER_PATH = import.meta.env.VITE_BANNER_PATH;

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [bannerUrl, setBannerUrl] = useState(null);
  const [isDefault, setIsDefult] = useState(null);

  useEffect(() => {
    try {
      if (userData.userTheme.bannerId) {
        setBannerUrl(
          `${CLOUDFLARE_PATH}/${BANNER_PATH}/${userData.userTheme.bannerImg.path}.${userData.userTheme.bannerImg.extension}`
        );
        setIsDefult(false);
      } else {
        setBannerUrl(banner);
        setIsDefult(true);
      }
    } catch {
      setBannerUrl(banner);
      setIsDefult(true);
    }
  }, [userData]);

  return (
    <>
      <img
        src={bannerUrl}
        className={!isDefault ? "UserAccBanner" : "default-banner"}
      />

      <img
        src={`${CLOUDFLARE_PATH}/${AVATAR_PATH}/${userData.avatar.path}.${userData.avatar.extension}`}
        className="UserAccAvatar"
        style={
          userData.userTheme && userData.userTheme.background
            ? { borderColor: userData.userTheme.background }
            : null
        }
      />
      <h1
        className="UserAccUsername text-center"
        style={
          userData.userTheme && userData.userTheme.primaryColor
            ? {
                color: userData.userTheme.primaryColor,
              }
            : null
        }
      >
        {userData.username}
      </h1>
    </>
  );
}

import { FaUserPlus } from "react-icons/fa";
import "../styles/OtherUsersProfileHeader.scss";
import banner from "../assets/default_banner.png";
import { useEffect, useState } from "react";

export default function OtherUsersProfileHeader({ userData }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [bannerUrl, setBannerUrl] = useState(null);
  const [isDefault, setIsDefult] = useState(null);

  useEffect(() => {
    try {
      //console.log("Banner use effect");
      if (userData.userTheme.bannerId) {
        //console.log("Bannnerrrr");
        setBannerUrl(`${BASE_URL}/api/user/banner/${userData.userTheme.bannerId}`);
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
  }, [userData]);
  

  return (
    <>
      <img
        src={bannerUrl}
        className={!isDefault ? "UserAccBanner" : "default-banner"}
      />

      <img src={`${BASE_URL}/api/User/avatar/${userData.avatarId}`} className="UserAccAvatar" style={userData.userTheme&&userData.userTheme.background?{borderColor:userData.userTheme.background}:null}/>
      <h1 className="UserAccUsername text-center" style={
        userData.userTheme&&userData.userTheme.primaryColor
          ? {
              color: userData.userTheme.primaryColor,
            }
          : null
      }>{userData.username}</h1>
    </>
  );
}

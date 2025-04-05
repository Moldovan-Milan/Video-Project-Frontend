import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/UserAccount.scss";
import UserAccountHeader from "../components/UserAccountHeader";
import UserAccountDetailsPanel from "../components/UserAccountDetailsPanel";
import UserAccountVideosPanel from "../components/UserAccountVideosPanel";
import { UserContext } from "../components/contexts/UserProvider";
import UserEditComponent from "../components/UserEditComponent";
import isColorDark from "../functions/isColorDark";

const UserAccount = () => {
  //TODO: Ha be vagyunk jelentkezve, és a SingleVideo-nál rányomunk a saját csatornánkra, ne az OtherUsersProfile-ra dobjon, hanem irányítson át ide
  const { id } = useParams();
  const [pageNumber, setPageNumber] = useState(1);
  const [userVideos,setUserVideos]=useState([]);
  const pageSize = 30;
  const { user } = useContext(UserContext);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    avatar: "",
    followers: 0,
    created: "",
    userTheme: {},
  });

  const [switchPanel, setSwitchPanel] = useState("Videos");

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchUser = async () => {
      if (user) {
        try {
          const { data } = await axios.get(
            `/api/user/profile?pageNumber=${pageNumber}&pageSize=${pageSize}`,
            {
              withCredentials: true,
            }
          );

          const formattedDate = new Date(data.created).toLocaleDateString(
            "hu-HU",
            { year: "numeric", month: "2-digit", day: "2-digit" }
          );
          setUserData({
            username: data.userName,
            email: data.email,
            avatar: `${BASE_URL}/api/User/avatar/${data.avatarId}`,
            followers: data.followersCount,
            created: formattedDate,
            userTheme: data.userTheme,
          });
          setUserVideos(data.videos);
          console.log(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (userData) {
      document.title = `Page for ${userData.username} | Omega Stream`;
    }
  }, [userData]);

  return (
    <div
      className="container"
      style={
        userData.userTheme&&userData.userTheme.background
          ? {
              background: userData.userTheme.background,
              color: (isColorDark(userData.userTheme.background))?"white":"black"
            }
          : null
      }
    >
      <UserAccountHeader user={userData} />
      <div className="divUserAccPanelSwitch">
        <button
          className={
            (switchPanel === "Videos")
              ? ("btnUserAccPanelActive")
              : ("btnUserAccBottomPanel")
          }

          style={
            (switchPanel==="Videos"&&userData.userTheme&&userData.userTheme.secondaryColor)
                ?{backgroundColor:userData.userTheme.secondaryColor,
                  boxShadow:`0 0 20px ${userData.userTheme.secondaryColor}`,
                  color:(isColorDark(userData.userTheme.secondaryColor)?"white":"black")}
                :
                ((switchPanel!=="Videos"&&userData.userTheme&&userData.userTheme.primaryColor)
                    ?{backgroundColor:userData.userTheme.primaryColor,
                      color:(isColorDark(userData.userTheme.primaryColor)
                          ?"white":"black")}
                            :null)}
          onClick={() => setSwitchPanel("Videos")}
        >
          Edit your videos
        </button>
        <button
          className={
            switchPanel === "Details"
              ? "btnUserAccPanelActive"
              : "btnUserAccBottomPanel"
          }
          style={(switchPanel!=="Videos"&&userData.userTheme&&userData.userTheme.secondaryColor)?{backgroundColor:userData.userTheme.secondaryColor, boxShadow:`0 0 20px ${userData.userTheme.secondaryColor}`,color:(isColorDark(userData.userTheme.secondaryColor)?"white":"black")}:((switchPanel==="Videos"&&userData.userTheme&&userData.userTheme.primaryColor)?{backgroundColor:userData.userTheme.primaryColor, color:(isColorDark(userData.userTheme.primaryColor)?"white":"black")}:null)}
          onClick={() => setSwitchPanel("Details")}
        >
          Details
        </button>
      </div>
      <div>
        {switchPanel === "Videos" ? (
          <UserAccountVideosPanel videos={userVideos} styles={userData.userTheme}/>
        ) : (
          <UserAccountDetailsPanel user={userData} />
        )}
      </div>
    </div>
  );
};

export default UserAccount;

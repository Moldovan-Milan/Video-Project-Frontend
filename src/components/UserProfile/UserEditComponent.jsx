import React from "react";
import UserAccountDetailsPanel from "./UserAccountDetailsPanel";
import UserAccountVideosPanel from "./UserAccountVideosPanel";
import UserAccountHeader from "./UserAccountHeader";
import { useState } from "react";
import isColorDark from "../../functions/isColorDark";

const UserEditComponent = ({ userData, userVideos }) => {
  const [switchPanel, setSwitchPanel] = useState("Videos");
  return (
    <div
      className="container UserAccMainDiv"
      style={
        userData.userTheme && userData.userTheme.background
          ? {
              background: userData.userTheme.background,
              color: isColorDark(userData.userTheme.background)
                ? "white"
                : "black",
            }
          : null
      }
    >
      <UserAccountHeader user={userData} />
      <div className="divUserAccPanelSwitch">
        <button
          className={
            switchPanel === "Videos"
              ? "btnUserAccPanelActive"
              : "btnUserAccBottomPanel"
          }
          style={
            switchPanel === "Videos" &&
            userData.userTheme &&
            userData.userTheme.secondaryColor
              ? {
                  backgroundColor: userData.userTheme.secondaryColor,
                  boxShadow: `0 0 20px ${userData.userTheme.secondaryColor}`,
                  color: isColorDark(userData.userTheme.secondaryColor)
                    ? "white"
                    : "black",
                }
              : switchPanel !== "Videos" &&
                userData.userTheme &&
                userData.userTheme.primaryColor
              ? {
                  backgroundColor: userData.userTheme.primaryColor,
                  color: isColorDark(userData.userTheme.primaryColor)
                    ? "white"
                    : "black",
                }
              : null
          }
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
          style={
            switchPanel !== "Videos" &&
            userData.userTheme &&
            userData.userTheme.secondaryColor
              ? {
                  backgroundColor: userData.userTheme.secondaryColor,
                  boxShadow: `0 0 20px ${userData.userTheme.secondaryColor}`,
                  color: isColorDark(userData.userTheme.secondaryColor)
                    ? "white"
                    : "black",
                }
              : switchPanel === "Videos" &&
                userData.userTheme &&
                userData.userTheme.primaryColor
              ? {
                  backgroundColor: userData.userTheme.primaryColor,
                  color: isColorDark(userData.userTheme.primaryColor)
                    ? "white"
                    : "black",
                }
              : null
          }
          onClick={() => setSwitchPanel("Details")}
        >
          Details
        </button>
      </div>
      <div>
        {switchPanel === "Videos" ? (
          <UserAccountVideosPanel
            videos={userVideos}
            styles={userData.userTheme}
          />
        ) : (
          <UserAccountDetailsPanel userData={userData} />
        )}
      </div>
    </div>
  );
};

export default UserEditComponent;

import ImageEditor from "../ImageEditor";
import "../../styles/UserProfile/UserAccountDetailsPanel.scss";
import { FaPencil } from "react-icons/fa6";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";
import { UserContext } from "../contexts/UserProvider";
import { useNavigate } from "react-router-dom";
import VerificationRequestButton from "../Admin/VerificationRequestButton";
import getActiveVerificationRequestStatus from "../../functions/getActiveVerificationRequestStatus";
import getRoles from "../../functions/getRoles";
import { FaUpload, FaSave } from "react-icons/fa";
import isColorDark from "../../functions/isColorDark";
import ThumbnailUpload from "../ThumbnailUpload";

export default function UserAccountDetailsPanel({ userData }) {
  const [editing, setEditing] = useState(null);
  const [editingTheme, setEditingTheme] = useState(null);
  const [banner, setBanner] = useState(null);
  const [bg, setBg] = useState(null);
  const [primaryColor, setPrimaryColor] = useState(null);
  const [secondaryColor, setSecondaryColor] = useState(null);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  let editDialog = null;
  let themeDialog = null;
  const { user, setUser } = useContext(UserContext);
  const [roles, setRoles] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const setDefaultAvatar = async () => {
      setAvatar(`${userData.avatar}`);
    };
    setDefaultAvatar();
  }, []);

  useEffect(() => {
    const checkVerificationRequest = async () => {
      const hasRequest = await getActiveVerificationRequestStatus(userData.id);
      setHasActiveRequest(hasRequest);
    };
    checkVerificationRequest();
  }, []);

  useEffect(() => {
    const loadRoles = async () => {
      const fetchedRoles = await getRoles(user.id);
      setRoles(fetchedRoles);
      const fetchedUserRoles = await getRoles(userData.id);
      setUserRoles(fetchedUserRoles);
    };

    if (user) {
      loadRoles();
    }
  }, [user]);

  const HandleNameUpdate = async () => {
    if (editing != "") {
      userData.username = editing;
      setEditing(null);
      let URL = `api/user/profile/update-username?newName=${userData.username}`;
      if (roles.includes("Admin") && user.id != userData.id) {
        URL = `api/Admin/edit-user/${userData.id}?username=${userData.username}`;
      }

      const response = await axios.patch(URL, {}, { withCredentials: true });
      if (response.status === 200) {
        window.alert(
          `Username changed successfully the new name is: ${userData.username}`
        );
        location.reload();
      } else if (response.status === 204) {
        window.alert("You succesfully changed this user's name!");
        location.reload();
      } else {
        window.alert("Username change is unsuccessful!");
      }
    } else {
      window.alert("Type in a new username!");
    }
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Warning: Deleting your account is permanent! All your videos, comments, and data will be erased forever. This action CANNOT be undone."
    );

    if (!confirmation) return;

    try {
      let URL = `/api/User/profile/delete-account`;
      if (roles.includes("Admin") && user.id != userData.id) {
        URL = `/api/Admin/delete-user/${userData.id}`;
      }
      const response = await axios.delete(URL, {
        withCredentials: true,
      });

      if (response.status === 204) {
        if (user.id === userData.id) {
          setUser(null);
        }
        window.alert("Account has been successfully deleted.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      window.alert(
        "An error occurred while deleting account. Please try again."
      );
    }
  };

  const handleAvatarSave = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);
    const response = await axios.post(
      `/api/user/change-avatar/${userData.id}`,
      formData,
      { withCredentials: true }
    );
    if (response.status === 200) {
      window.alert("Successfully Changed Profile Picture!");
      window.location.href = window.location.href;
    }
  };

  const handleVerificationRequest = () => {
    setHasActiveRequest(true);
  };

  const HandleThemeUpload = async () => {
    const formData = new FormData();
    formData.append("background", bg);
    formData.append("primaryColor", primaryColor);
    formData.append("secondaryColor", secondaryColor);
    formData.append("bannerImage", banner);

    const response = await axios.post("api/user/profile/set-theme", formData, {
      withCredentials: true,
    });
    if (response.status === 200) {
      window.alert("Custom theme uploaded successfully!");
      location.reload();
    } else {
      window.alert("Custom theme uploaded is unsuccessful!");
    }
  };

  if (editing != null) {
    editDialog = (
      <div className="editBg">
        <div className="editUsernameWindow">
          <h1>
            Editing <span className="titleEditUname">{userData.username}</span>
            's username
          </h1>
          <div>
            <label>New username: </label>
            <input
              value={editing}
              onChange={(e) =>
                setEditing((prev) => {
                  prev = e.target.value;
                  return prev;
                })
              }
            />
          </div>
          <div>
            <button
              onClick={() => HandleNameUpdate()}
              className="editUsernameSave"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(null)}
              className="editUsernameCancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editingTheme != null) {
    themeDialog = (
      <div className="editBg">
        <div className="editThemeWindow">
          <h1>
            <span className="titleEditUname">{userData.username}</span>'s theme
          </h1>
          <p className="m-1">Background color </p>
          <input
            type="color"
            onChange={(e) => setBg(e.target.value)}
            defaultValue={
              userData.userTheme && userData.userTheme.background
                ? userData.userTheme.background
                : null
            }
            className="themeColorInput"
          />
          <p className="m-1">Primary color </p>
          <input
            type="color"
            onChange={(e) => setPrimaryColor(e.target.value)}
            defaultValue={
              userData.userTheme && userData.userTheme.primaryColor
                ? userData.userTheme.primaryColor
                : null
            }
            className="themeColorInput"
          />
          <p className="m-1">Secondary color</p>
          <input
            type="color"
            onChange={(e) => setSecondaryColor(e.target.value)}
            defaultValue={
              userData.userTheme && userData.userTheme.secondaryColor
                ? userData.userTheme.secondaryColor
                : null
            }
            className="themeColorInput"
          />
          <p className="m-1">Upload a banner: </p>
          <div className="mb-4">
            <input
              id="uploadBanner"
              type="file"
              onChange={(e) => setBanner(e.target.files[0])}
              accept=".png"
              hidden
            />
            <label htmlFor="uploadBanner" className="BannerUploadBtn">
              <FaUpload className="upload-icn m-1" /> Choose a banner
            </label>
            {banner && (
              <div className="mt-4">
                <p className="mt-2 text-sm text-center m-3">
                  Selected: <strong>{banner.name}</strong> (
                  {(banner.size / 1024 / 1024).toFixed(2)} MB)
                </p>
                <img
                  src={URL.createObjectURL(banner)}
                  className="rounded-md shadow-md"
                  style={{ margin: "auto", maxHeight: 180, maxWidth: 320 }}
                />
              </div>
            )}
          </div>
          {bg || primaryColor || secondaryColor || banner ? (
            <button
              onClick={() => {
                console.log(banner);
                console.log(bg);
                HandleThemeUpload();
              }}
              className="text-white font-bold py-2 px-4 rounded mb-2 btnThemeUpload"
            >
              <FaUpload className="m-1" />
              Upload theme
            </button>
          ) : (
            <></>
          )}
          <div>
            <button
              onClick={() => setEditingTheme(null)}
              className="editUsernameCancel"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="DivDetailsPanel">
      {editDialog}
      {themeDialog}
      <h2
        style={
          userData.userTheme && userData.userTheme.secondaryColor
            ? { color: userData.userTheme.secondaryColor }
            : null
        }
      >
        Account details
      </h2>
      <hr className="AccLine"></hr>
      <div className="DivAccDetails">
        <label>Channel name: </label>
        <div className="UserAccNameEditDiv">
          <p
            className="AccInfo"
            style={
              userData.userTheme && userData.userTheme.primaryColor
                ? { color: userData.userTheme.primaryColor }
                : null
            }
          >
            {userData.username}
          </p>
          <button
            className="editUnsernameBtn"
            onClick={() => setEditing(userData.username)}
            style={
              userData.userTheme && userData.userTheme.secondaryColor
                ? { backgroundColor: userData.userTheme.secondaryColor }
                : null
            }
          >
            <FaPencil className="m-1" />
          </button>
        </div>
      </div>
      <div className="DivAccDetails">
        <label>Email address: </label>
        <p
          className="AccInfo"
          style={
            userData.userTheme && userData.userTheme.primaryColor
              ? { color: userData.userTheme.primaryColor }
              : null
          }
        >
          {userData.email}
        </p>
      </div>
      <div className="DivAccDetails">
        <label>Created at: </label>
        <p
          className="AccInfo"
          style={
            userData.userTheme && userData.userTheme.primaryColor
              ? { color: userData.userTheme.primaryColor }
              : null
          }
        >
          {userData.created}
        </p>
      </div>
      {roles.includes("Admin") &&
        !hasActiveRequest &&
        !userRoles.includes("Verified") && <button>Verify User</button>}

      {user.id === userData.id &&
        !roles?.includes("Verified") &&
        !hasActiveRequest && (
          <VerificationRequestButton
            onRequestSent={handleVerificationRequest}
          />
        )}

      <h2
        style={
          userData.userTheme && userData.userTheme.secondaryColor
            ? { color: userData.userTheme.secondaryColor }
            : null
        }
      >
        Choose your theme
      </h2>
      <hr className="AccLine"></hr>
      <button
        onClick={() => setEditingTheme(true)}
        className="font-bold py-2 px-4 rounded mb-2 btnEditTheme m-1"
        style={
          userData.userTheme && userData.userTheme.primaryColor
            ? {
                backgroundColor: userData.userTheme.primaryColor,
                color: isColorDark(userData.userTheme.primaryColor)
                  ? "white"
                  : "black",
              }
            : null
        }
      >
        Edit theme
      </button>

      <div>
        <h2>Edit Profile Picture</h2>
        <ThumbnailUpload
          thumbnail={avatar}
          width={192}
          height={192}
          borderRadius={100}
          setThumbnail={setAvatar}
        />
        <button
          onClick={handleAvatarSave}
          className="font-bold py-2 px-4 rounded mb-6 btnEditTheme m-1"
          style={
            userData.userTheme && userData.userTheme.primaryColor
              ? {
                  backgroundColor: userData.userTheme.primaryColor,
                  color: isColorDark(userData.userTheme.primaryColor)
                    ? "white"
                    : "black",
                }
              : null
          }
        >
          <p className="flex">
            <FaSave className="m-1" /> Save profile picture
          </p>
        </button>
      </div>
      <button className="deleteBtn" onClick={handleDelete}>
        <FaTrash className="m-1" /> Delete account
      </button>
    </div>
  );
}

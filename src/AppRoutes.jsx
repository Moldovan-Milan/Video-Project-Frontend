import React from "react";
import { Routes, Route } from "react-router-dom";
import VideosPage from "./pages/VideosPage";
import SingleVideo from "./pages/SingleVideo";
import UploadVideo from "./pages/UploadVideo";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import UserAccount from "./pages/UserAccount";
import OtherUsersProfile from "./pages/OtherUsersProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index path="/" Component={VideosPage} />
      <Route path="/video/:id" Component={SingleVideo} />
      <Route path="/video/upload" Component={UploadVideo} />
      <Route path="/registration" Component={Registration} />
      <Route path="/login" Component={Login} />
      <Route path="/profile" Component={UserAccount} />
      <Route path="/profile/:id" Component={OtherUsersProfile} />
    </Routes>
  );
};

export default AppRoutes;

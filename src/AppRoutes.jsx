import React from "react";
import { Routes, Route } from "react-router-dom";
import VideosPage from "./pages/VideosPage";
import SingleVideo from "./pages/SingleVideo";
import UploadVideo from "./pages/UploadVideo";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import UserAccount from "./pages/UserAccount";
import OtherUsersProfile from "./pages/OtherUsersProfile";
import ChatPage from "./pages/ChatPage";
import MessagePage from "./pages/MessagePage";
import EditVideoPage from "./pages/EditVideoPage";
import LiveStreamPage from "./pages/LiveStreamPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route index path="/" Component={VideosPage} />
      <Route path="/video/:id" Component={SingleVideo} />
      <Route path="/video/:id/edit" Component={EditVideoPage}/> 
      <Route path="/video/upload" Component={UploadVideo} />
      <Route path="/registration" Component={Registration} />
      <Route path="/login" Component={Login} />
      <Route path="/profile" Component={UserAccount} />
      <Route path="/profile/:id" Component={OtherUsersProfile} />
      <Route path="/chats" Component={ChatPage} />
      <Route path="/chat/:id" Component={MessagePage} />
      <Route path="/livestream/:id" Component={LiveStreamPage}/>
      
    </Routes>
  );
};

export default AppRoutes;

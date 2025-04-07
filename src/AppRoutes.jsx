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
import LiveStreamPage from "./pages/LiveStreamPage";
import GoLivePage from "./pages/GoLivePage";
import EditVideoPage from "./pages/EditVideoPage";
import WatchTogetherMainPage from "./pages/WatchTogetherMainPage";
import WatchTogetherRoom from "./pages/WatchTogetherRoom";
import SearchResultPage from "./pages/SearchResultPage";
import ViewHistoryPage from "./pages/ViewHistoryPage";
import SubscribedToPage from "./pages/SubscribedToPage";
import LiveStreamList from "./pages/LiveStreamList";
import ShortsPage from "./pages/ShortsPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import EditUser from "./pages/EditUser";
import VerificationRequestList from "./pages/VerificationRequestList";
import UserSearchPage from "./pages/UserSearchPage";
import EditUserRoles from "./pages/EditUserRoles";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index path="/" element={<VideosPage />} />
      <Route path="/video/:id" element={<SingleVideo />} />
      <Route path="/video/:id/edit" element={<EditVideoPage />} />
      <Route path="/video/upload" element={<UploadVideo />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<UserAccount />} />
      <Route path="/profile/:id" element={<OtherUsersProfile />} />
      <Route path="/profile/:id/edit" element={<EditUser />} />
      <Route path="/chats" element={<ChatPage />} />
      <Route path="/chat/:id" element={<MessagePage />} />
      <Route path="/livestream/:id" Component={LiveStreamPage} />
      <Route path="/go-live" Component={GoLivePage} />
      <Route path="/livestream" Component={LiveStreamList} />
      <Route path="/search" element={<SearchResultPage />} />
      <Route path="/watch-history" element={<ViewHistoryPage />} />
      <Route path="/following" element={<SubscribedToPage />} />
      <Route path="/watch-together" element={<WatchTogetherMainPage />} />
      <Route path="/watch-together/:id" element={<WatchTogetherRoom />} />
      <Route path="/shorts" element={<ShortsPage />} />
      <Route path="/admin" element={<AdminPage />}>
        <Route path="verification-list" element={<VerificationRequestList />} />
        <Route path="edit-user-roles" element={<UserSearchPage />} />
        <Route path="edit-user-roles/:id" element={<EditUserRoles />} />
      </Route>
      <Route path="/not-found" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

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
import WatchTogetherMainPage from "./pages/WatchTogetherMainPage";
import WatchTogetherRoom from "./pages/WatchTogetherRoom";
import SearchResultPage from "./pages/SearchResultPage";
import ViewHistoryPage from "./pages/ViewHistoryPage";
import SubscribedToPage from "./pages/SubscribedToPage";
import ShortsPage from "./pages/ShortsPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import EditUser from "./pages/EditUser";
import ReviewVerificationPage from "./pages/ReviewVerificationPage";
import VerificationRequestList from "./pages/VerificationRequestList";

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
      <Route path="/search" element={<SearchResultPage />} />
      <Route path="/watch-history" element={<ViewHistoryPage />} />
      <Route path="/following" element={<SubscribedToPage />} />
      <Route path="/watch-together" element={<WatchTogetherMainPage />} />
      <Route path="/watch-together/:id" element={<WatchTogetherRoom />} />
      <Route path="/shorts" element={<ShortsPage />} />
      <Route path="/review-verification/:id" element={<ReviewVerificationPage />} />
      <Route path="/admin" element={<AdminPage />}>
        <Route path="verification-list" element={<VerificationRequestList />} />
      </Route>
      <Route path="/not-found" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;

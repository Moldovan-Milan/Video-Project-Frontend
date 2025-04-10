import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy betöltés
const VideosPage = React.lazy(() => import("./pages/VideosPage"));
const SingleVideo = React.lazy(() => import("./pages/SingleVideo"));
const UploadVideo = React.lazy(() => import("./pages/UploadVideo"));
const Registration = React.lazy(() => import("./pages/Registration"));
const Login = React.lazy(() => import("./pages/Login"));
const UserAccount = React.lazy(() => import("./pages/UserAccount"));
const OtherUsersProfile = React.lazy(() => import("./pages/OtherUsersProfile"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const MessagePage = React.lazy(() => import("./pages/MessagePage"));
const LiveStreamPage = React.lazy(() => import("./pages/LiveStreamPage"));
const GoLivePage = React.lazy(() => import("./pages/GoLivePage"));
const EditVideoPage = React.lazy(() => import("./pages/EditVideoPage"));
const WatchTogetherMainPage = React.lazy(() =>
  import("./pages/WatchTogetherMainPage")
);
const WatchTogetherRoom = React.lazy(() => import("./pages/WatchTogetherRoom"));
const SearchResultPage = React.lazy(() => import("./pages/SearchResultPage"));
const ViewHistoryPage = React.lazy(() => import("./pages/ViewHistoryPage"));
const SubscribedToPage = React.lazy(() => import("./pages/SubscribedToPage"));
const LiveStreamList = React.lazy(() => import("./pages/LiveStreamList"));
const ShortsPage = React.lazy(() => import("./pages/ShortsPage"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));
const EditUser = React.lazy(() => import("./pages/EditUser"));
const VerificationRequestList = React.lazy(() =>
  import("./pages/VerificationRequestList")
);
const UserSearchPage = React.lazy(() => import("./pages/UserSearchPage"));
const EditUserRoles = React.lazy(() => import("./pages/EditUserRoles"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
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
        <Route path="/livestream/:id" element={<LiveStreamPage />} />
        <Route path="/go-live" element={<GoLivePage />} />
        <Route path="/livestream" element={<LiveStreamList />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/watch-history" element={<ViewHistoryPage />} />
        <Route path="/following" element={<SubscribedToPage />} />
        <Route path="/watch-together" element={<WatchTogetherMainPage />} />
        <Route path="/watch-together/:id" element={<WatchTogetherRoom />} />
        <Route path="/shorts" element={<ShortsPage />} />
        <Route path="/admin" element={<AdminPage />}>
          <Route
            path="verification-list"
            element={<VerificationRequestList />}
          />
          <Route path="edit-user-roles" element={<UserSearchPage />} />
          <Route path="edit-user-roles/:id" element={<EditUserRoles />} />
        </Route>
        <Route path="/not-found" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;

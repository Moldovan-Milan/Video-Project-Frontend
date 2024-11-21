import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import VideosPage from "./pages/VideosPage";
import SingleVideo from "./pages/SingleVideo";
import UploadVideo from "./pages/UploadVideo";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";

axios.defaults.baseURL = "https://localhost:7124";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" Component={VideosPage} />
        <Route path="/video/:id" Component={SingleVideo} />
        <Route path="/video/upload" Component={UploadVideo} />
        <Route path="/registration" Component={Registration} />
        <Route path="/login" Component={Login} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

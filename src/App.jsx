import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import VideosPage from "./pages/VideosPage";
import SingleVideo from "./pages/SingleVideo";
import UploadVideo from "./pages/UploadVideo";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "./components/NavbarComponent";
import SearchBar from "./components/SearchBar";
import UserAccount from "./pages/UserAccount";

axios.defaults.baseURL = "https://localhost:7124";
function App() {
  return (
    <BrowserRouter>
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossOrigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
        integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
        crossOrigin="anonymous"
      ></script>
      <SearchBar />
      <div
        className="container"
        style={{ marginLeft: "0px", padding: "0px", marginBottom: "0px" }}
      >
        <div className="row" style={{ width: "100%", paddingBottom: "0px" }}>
          <div className="col-md-3 navbar-fixed">
            <NavbarComponent />
          </div>
          <div className="col-md-9">
            <Routes>
              <Route index path="/" Component={VideosPage} />
              <Route path="/video/:id" Component={SingleVideo} />
              <Route path="/video/upload" Component={UploadVideo} />
              <Route path="/registration" Component={Registration} />
              <Route path="/login" Component={Login} />
              <Route path="/profile" Component={UserAccount} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

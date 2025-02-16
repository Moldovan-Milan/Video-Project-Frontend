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
import "./output.css";
import OtherUsersProfile from "./pages/OtherUsersProfile";
import { useContext, useEffect, useState } from "react";
import tryLoginUser from "./functions/tryLoginUser";
import ContextProvider from "./components/contexts/ContextProvider";
import { UserContext } from "./components/contexts/UserProvider";
import AppRoutes from "./AppRoutes";

axios.defaults.baseURL = "https://localhost:7124";
function App() {
  // Ez fog lefutni az oldal első betöltésekor
  const [token, setToken] = useState();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await tryLoginUser();
      setToken(token);
    };

    fetchToken();
  }, []);

  return (
    <ContextProvider>
      <BrowserRouter>
        {/* <script
          src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
          integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
          crossOrigin="anonymous"
        ></script>
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.min.js"
          integrity="sha384-0pUGZvbkm6XF6gxjEnlmuGrJXVbNuzT9qBBavbLwCsOGabYfZo0T0to5eqruptLy"
          crossOrigin="anonymous"
        ></script> */}
        <SearchBar />
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-2">
            <NavbarComponent
              setToken={setToken}
              token={token}
              className="sticky"
            />
          </div>
          <div className="lg:col-span-10">
            <AppRoutes />
          </div>
        </div>
      </BrowserRouter>
    </ContextProvider>
  );
}

export default App;

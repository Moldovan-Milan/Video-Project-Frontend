import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "./components/NavbarComponent";
import SearchBar from "./components/SearchBar";
import "./output.css";
import { useContext, useEffect, useState } from "react";
import tryLoginUser from "./functions/tryLoginUser";
import { UserContext, UserProvider } from "./components/contexts/UserProvider";
import AppRoutes from "./AppRoutes";
import { WebSocketProvider } from "./components/contexts/WebSocketProvider";

axios.defaults.baseURL = "https://localhost:7124";
function App() {
  // Ez fog lefutni az oldal első betöltésekor
  const [token, setToken] = useState();

  useEffect(() => {
    const fetchToken = async () => {
      const token = await tryLoginUser();
      setToken(token);
    };

    fetchToken();
  }, []);

  return (
    <WebSocketProvider>
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
    </WebSocketProvider>
  );
}

export default App;

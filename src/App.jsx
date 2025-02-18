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
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await tryLoginUser();
      setToken(token);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    // Figyeljük a user állapot változásait
    console.log(user);
  }, [user]);

  return (
    <WebSocketProvider>
      <BrowserRouter>
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

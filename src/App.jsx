import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "./components/NavbarComponent";
import SearchBar from "./components/SearchBar";
import "./output.css";
import { useContext, useEffect, useState } from "react";
import { tryLoginUser } from "./functions/tryLoginUser";
import { UserContext } from "./components/contexts/UserProvider";
import AppRoutes from "./AppRoutes";
import { useWebSocket } from "./components/contexts/WebSocketProvider";
import { useSignalR } from "./components/contexts/SignalRProvider";

axios.defaults.baseURL = "https://localhost:7124";
function App() {
  // Ez fog lefutni az oldal első betöltésekor
  const { user, setUser } = useContext(UserContext);
  const { connectToServer } = useSignalR();

  useEffect(() => {
    const fetchToken = async () => {
      await tryLoginUser(setUser, connectToServer);
    };

    fetchToken();
  }, []);

  useEffect(() => {
    // Figyeljük a user állapot változásait
    connectToServer();
    console.log(user);
  }, [user]);

  return (
    <BrowserRouter>
      <SearchBar />
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-2">
          <NavbarComponent className="sticky" />
        </div>
        <div className="lg:col-span-10">
          <AppRoutes />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;

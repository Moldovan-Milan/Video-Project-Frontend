import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import "./output.css";
import { useContext, useEffect } from "react";
import { tryLoginUser } from "./functions/tryLoginUser";
import { UserContext } from "./components/contexts/UserProvider";
import AppRoutes from "./AppRoutes";
import { useSignalR } from "./components/contexts/SignalRProvider";
import NavbarComponent from "./components/NavbarComponent";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

function App() {
  const { user, setUser } = useContext(UserContext);
  const { connectToServer, connection } = useSignalR();

  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            console.log("Token lejárt, frissítés...");
            await tryLoginUser(setUser, connectToServer, connection);
            originalRequest.withCredentials = true; // Send the new access token
            //console.log(originalRequest.headers);
            return axios(originalRequest);
          } catch (refreshError) {
            console.error("Token frissítés sikertelen:", refreshError);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [setUser, connectToServer, connection]);

  useEffect(() => {
    const fetchToken = async () => {
      await tryLoginUser(setUser, connectToServer, connection);
    };

    fetchToken();
  }, []);

  useEffect(() => {
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

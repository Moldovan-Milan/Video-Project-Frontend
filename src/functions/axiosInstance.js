import axios from "axios";
import { tryLoginUser } from "./tryLoginUser";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const setupAxiosInterceptors = (
  setUser,
  connectToServer,
  connection
) => {
  axiosInstance.interceptors.response.use(
    (response) => response, // Ha rendben van, megy tovább a kérés
    async (error) => {
      // Hiba esetén lefut
      if (error.response && error.response.status === 401) {
        const user = tryLoginUser(setUser, connectToServer, connection);

        if (user) {
          return axiosInstance(error.config);
        } else {
          setUser(null);
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default axiosInstance;

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./components/contexts/UserProvider.jsx";
import { WebSocketProvider } from "./components/contexts/WebSocketProvider.jsx";
import { SignalRProvider } from "./components/contexts/SignalRProvider.jsx";
import { WtSignalRProvider } from "./components/contexts/WatchTogetherSingalRProvider.jsx";
import { AuthProvider } from "./components/contexts/AuthContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <AuthProvider>
        <SignalRProvider>
          <WtSignalRProvider>
            <App />
          </WtSignalRProvider>
        </SignalRProvider>
      </AuthProvider>
    </UserProvider>
  </QueryClientProvider>
);

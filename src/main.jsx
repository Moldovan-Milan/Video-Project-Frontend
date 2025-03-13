import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./components/contexts/UserProvider.jsx";
import { WebSocketProvider } from "./components/contexts/WebSocketProvider.jsx";
import { SignalRProvider } from "./components/contexts/SignalRProvider.jsx";
import { WtSingalRProvider } from "./components/contexts/WatchTogetherSingalRProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <SignalRProvider>
        <WtSingalRProvider>
          <App />
        </WtSingalRProvider>
      </SignalRProvider>
    </UserProvider>
  </QueryClientProvider>
);

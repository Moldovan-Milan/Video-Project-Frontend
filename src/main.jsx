import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { UserProvider } from "./components/contexts/UserProvider.jsx";
import { WebSocketProvider } from "./components/contexts/WebSocketProvider.jsx";
import { SignalRProvider } from "./components/contexts/SignalRProvider.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <SignalRProvider>
        <App />
      </SignalRProvider>
    </UserProvider>
  </QueryClientProvider>
);

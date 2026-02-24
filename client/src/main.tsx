import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { useStore } from "./lib/store";

// Initialize the store from the backend
useStore.getState().initialize();

createRoot(document.getElementById("root")!).render(<App />);

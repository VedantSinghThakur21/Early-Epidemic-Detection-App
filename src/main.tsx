
  import { createRoot } from "react-dom/client";
  // TEMPORARILY using simple version to avoid @radix-ui errors
  import App from "./App.simple";
  import "./index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  
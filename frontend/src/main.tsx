import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store from "./Redux/store.ts";

createRoot(document.getElementById("root")!).render(
  // application get the redux store
  <Provider store={store}>
    {/* capability of react-router-dom is access and routing is doing easily
    because of BrowserRouter */}
    <BrowserRouter>
      <App />
      {/* toaster functionality in all over the app */}
      <Toaster />
    </BrowserRouter>
  </Provider>
);

import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { TanStackRouterDevtoolsWrapper } from "./TanStackRouterDevtoolsWrapper";
import "./index.css";
import { router } from "./router";

const rootElement = document.getElementById("root")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <RouterProvider router={router} />
      <TanStackRouterDevtoolsWrapper router={router} position="bottom-right" />
    </StrictMode>
  );
}

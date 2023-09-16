import { lazy } from "react";

export const TanStackRouterDevtoolsWrapper =
  import.meta.env.NODE_ENV === "production"
    ? () => null
    : lazy(() =>
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
        }))
      );

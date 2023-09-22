import { RegisteredRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { TanStackRouterDevtoolsWrapper } from "./TanStackRouterDevtoolsWrapper";

export function App({
  router,
  head,
}: {
  router: RegisteredRouter;
  head: string;
}) {
  return (
    <html lang="fr">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App with Tanstack router and SSR streaming</title>
        <meta
          name="description"
          content="Vite App with Tanstack router and SSR streaming using Tanstack Start"
        />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `</script>${head}<script>`,
          }}
        />
      </head>
      <body>
        <StrictMode>
          <RouterProvider router={router} />
          <TanStackRouterDevtoolsWrapper
            router={router}
            position="bottom-right"
          />
        </StrictMode>
      </body>
    </html>
  );
}

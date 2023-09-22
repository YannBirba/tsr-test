import express from "express";
import getPort, { portNumbers } from "get-port";
import { dirname, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

process.env.MY_CUSTOM_SECRET = "API_KEY_qwertyuiop";

export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production",
  hmrPort
) {
  const resolveCurrentDir = (p) => resolve(__dirname, p);

  const app = express();

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await (
      await import("vite")
    ).createServer({
      root,
      logLevel: isTest ? "error" : "info",
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: "custom",
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import("compression")).default());
    app.use(
      (await import("serve-static")).default(resolveCurrentDir("dist/client"), {
        index: false,
      })
    );
  }

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      if (url.includes(".")) {
        console.warn(`${url} is not valid router path`);
        return res.status(404);
      }

      // Extract the head from vite's index transformation hook
      let viteHead = !isProd
        ? await vite.transformIndexHtml(
            url,
            `<html><head></head><body></body></html>`
          )
        : "";

      viteHead = viteHead.substring(
        viteHead.indexOf("<head>") + 6,
        viteHead.indexOf("</head>")
      );

      const entry = await (async () => {
        if (!isProd) {
          return vite.ssrLoadModule("/src/entry-server.tsx");
        } else {
          return import("./dist/server/entry-server.js");
        }
      })();

      // Control/hydrate all the way up to <html>
      // Modify head
      // Request/Response control at the route level

      entry.render({ req, res, url, head: viteHead });
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  // @ts-expect-error - vite will be defined if not in production
  return { app, vite };
}

if (!isTest) {
  createServer().then(async ({ app }) =>
    app.listen(await getPort({ port: portNumbers(3000, 3100) }), () => {
      console.log("⚡ Client Server: http://localhost:3000");
    })
  );
}

import { createMemoryHistory } from "@tanstack/react-router";
import {
  StartServer,
  transformStreamWithRouter,
} from "@tanstack/react-start/server";
import { Request } from "express";
import { ServerResponse } from "http";
import isbot from "isbot";
import { PipeableStream, renderToPipeableStream } from "react-dom/server";
import "./fetch-polyfill";
import { createRouter } from "./router";

export async function render({
  head,
  req,
  res,
  url,
}: {
  url: string;
  head: string;
  req: Request;
  res: ServerResponse;
}) {
  const router = createRouter();

  const memoryHistory = createMemoryHistory({
    initialEntries: [url],
  });

  router.update({
    history: memoryHistory,
    context: {
      head,
      req,
      res,
    },
  });

  await router.load();

  // Track errors
  let didError = false;

  // Clever way to get the right callback. Thanks Remix!
  const callbackName = isbot(req.headers["user-agent"])
    ? "onAllReady"
    : "onShellReady";

  let stream!: PipeableStream;

  await new Promise<void>((resolve) => {
    stream = renderToPipeableStream(<StartServer router={router} />, {
      [callbackName]: () => {
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-Type", "text/html");
        resolve();
      },
      onError: (err) => {
        didError = true;
        console.log(err);
      },
    });
  });

  // Add our Router transform to the stream
  const transforms = [transformStreamWithRouter(router)];

  const transformedStream = transforms.reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (stream, transform) => stream.pipe(transform as any),
    stream
  );

  transformedStream.pipe(res);
}

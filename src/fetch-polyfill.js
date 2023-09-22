/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// fetch-polyfill.js
import fetch, { Headers, Request, Response } from "node-fetch";

if (!globalThis.fetch) {
  globalThis.fetch = fetch;
  globalThis.Headers = Headers;
  globalThis.Request = Request;
  globalThis.Response = Response;
}

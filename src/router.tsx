import {
  Link,
  Outlet,
  Route,
  Router,
  RouterContext,
  defer,
  lazyRouteComponent,
} from "@tanstack/react-router";
import { z } from "zod";
import { Root } from "./Root";
import { RouteError } from "./types/RouteError";

const routeContext = new RouterContext<{ apiUrl: string }>();

export const rootRoute = routeContext.createRootRoute({
  component: Root,
});

const slowFakeFetch = (): Promise<string> => {
  return new Promise((resolve) => setTimeout(() => resolve("slow data"), 2500));
};

const fastFakeFetch = (): Promise<string> => {
  return new Promise((resolve) => setTimeout(() => resolve("fast data"), 250));
};

export const homeRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./Views/Home"), "Home"),
  loader: async () => {
    const slowDataPromise = slowFakeFetch();

    const fastData = await fastFakeFetch();

    return {
      slowData: defer(slowDataPromise),
      fastData,
    };
  },
});

export const aboutRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "about",
  component: lazyRouteComponent(() => import("./Views/About"), "About"),
});

export const blogLayoutRoute = new Route({
  getParentRoute: () => rootRoute,
  id: "blog-layout",
  component: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyContent: "space-between",
        alignItems: "stretch",
      }}
    >
      <Outlet />
    </div>
  ),
});

export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export const blogRoute = new Route({
  getParentRoute: () => blogLayoutRoute,
  path: "blog",
  component: lazyRouteComponent(() => import("./Views/Blog"), "Blog"),
  validateSearch: z.object({
    userId: z.number().int().positive().optional(),
  }),
  key: ({ search }) => search.userId,
  loader: async ({ search, abortController, context }) => {
    const endpoint = search.userId
      ? `${context.apiUrl}/posts/?userId=${search.userId}`
      : `${context.apiUrl}/posts`;
    const res = await fetch(endpoint, { signal: abortController.signal });
    if (!res.ok) throw new Error("Impossible de charger les articles");
    const posts = (await res.json()) as Post[];
    return {
      posts,
    };
  },
});

export const blogIndexRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./Views/BlogIndex"), "BlogIndex"),
});

export const postRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "$slug",
  component: lazyRouteComponent(() => import("./Views/Post"), "Post"),
  loader: async ({ params, abortController, context }) => {
    const res = await fetch(
      `${context.apiUrl}/posts/${params.slug.split("-").pop()}`,
      { signal: abortController.signal }
    );
    if (res.status === 404) throw new Error("Article introuvable");
    if (!res.ok) throw new Error("Impossible de charger l'article");
    const post = (await res.json()) as Post;
    return {
      post,
    };
  },
  maxAge: 30_000,
});

export const newPostRoute = new Route({
  getParentRoute: () => blogRoute,
  path: "new",
  component: lazyRouteComponent(() => import("./Views/NewPost"), "NewPost"),
  errorComponent: ({ error }) => {
    const { message } = error as RouteError;
    return (
      <>
        <h1>Erreur de création</h1>
        <p>{message}</p>
      </>
    );
  },
});

export const fileBaseRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "file/*",
  component: lazyRouteComponent(() => import("./Views/File"), "File"),
});

export const notFoundRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => (
    <>
      <h1>404</h1> <Link to={homeRoute.to}>Go home</Link>
    </>
  ),
});

export const searchSchema = z.object({
  pageIndex: z.number().int().positive().catch(1),
  includeCategories: z.array(z.string()).catch([]),
  sortBy: z.enum(["price", "rating", "relevance"]).catch("relevance"),
  desc: z.boolean().catch(false),
  query: z.string().nonempty("Query cannot be empty"),
});

export type SearchParams = z.infer<typeof searchSchema>;

export const searchRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "search",
  component: lazyRouteComponent(() => import("./Views/Search"), "Search"),
  validateSearch: searchSchema,
  key: ({ search }) => search.query,
  errorComponent: ({ error }) => {
    const { routerCode } = error as RouteError<SearchParams>;
    return (
      <>
        <h1>Search error</h1>
        <pre>
          {routerCode === "VALIDATE_SEARCH"
            ? "Une erreur est survenue lors de la validation des paramètres de recherche"
            : "Une erreur est survenue"}
        </pre>
      </>
    );
  },
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  aboutRoute,
  blogLayoutRoute.addChildren([
    blogRoute.addChildren([newPostRoute, postRoute, blogIndexRoute]),
  ]),
  fileBaseRoute,
  notFoundRoute,
  searchRoute,
]);

if (!import.meta.env.VITE_API_URL) {
  throw new Error("VITE_API_URL is not defined");
}

const apiUrl = import.meta.env.VITE_API_URL as string;

export const createRouter = () => {
  return new Router({
    routeTree,
    defaultPendingComponent: () => <p>Loading...</p>,
    defaultErrorComponent: ({ error }) => {
      const { message } = error as RouteError;
      return (
        <>
          <h1>Erreur</h1>
          <p>{message}</p>
        </>
      );
    },
    reloadOnWindowFocus: true,
    defaultPreload: "intent",
    context: {
      apiUrl,
    },
  });
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}

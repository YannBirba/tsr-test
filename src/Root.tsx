import {
  Link,
  Outlet,
  ScrollRestoration,
  useRouter,
} from "@tanstack/react-router";
import { useEffect } from "react";
import {
  aboutRoute,
  blogRoute,
  fileBaseRoute,
  homeRoute,
  notFoundRoute,
  searchRoute,
} from "./router";

export const Root = () => {
  const router = useRouter();

  useEffect(() => {
    try {
      router.preloadRoute({ to: homeRoute.to });
    } catch (err) {
      if (err instanceof Error && err.name === "RouteError") {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }, [router]);

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link
              activeProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              activeOptions={{
                exact: true,
              }}
              to={homeRoute.to}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              activeProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              to={aboutRoute.to}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              activeProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              activeOptions={{
                includeSearch: true,
              }}
              to={blogRoute.to}
            >
              Blog
            </Link>
          </li>
          <li>
            <Link
              activeOptions={{
                includeSearch: true,
              }}
              activeProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              to={blogRoute.to}
              search={{
                userId: 3,
              }}
            >
              Blog userId 3
            </Link>
          </li>
          <li>
            <Link
              activeProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              to={fileBaseRoute.to}
              params={{
                "*": "test",
              }}
            >
              Display the test file
            </Link>
          </li>
          <li>
            <Link
              activeProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              to={fileBaseRoute.to}
              params={{
                "*": "test2",
              }}
            >
              Display the test2 file
            </Link>
          </li>
          <li>
            <form
              action="/search"
              method="get"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label htmlFor="query">Rechercher</label>
              <input
                id="query"
                type="text"
                autoComplete="tsr-test-search"
                inputMode="search"
                name="query"
                placeholder="Post 1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.currentTarget.form?.submit();
                  }
                }}
              />
            </form>
          </li>
          <li>
            <Link
              activeProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              activeOptions={{
                includeSearch: true,
              }}
              to={searchRoute.to}
              search={{
                pageIndex: 3,
                includeCategories: ["electronics", "gifts"],
                sortBy: "price",
                desc: true,
                query: "Post 1",
              }}
            >
              Search for <code>Post 1</code>
            </Link>
          </li>
          <li>
            <Link
              activeProps={{
                style: {
                  fontWeight: "bold",
                },
              }}
              to={notFoundRoute.to}
              params={{
                "*": "test",
              }}
            >
              404
            </Link>
          </li>
        </ul>
      </nav>
      <hr />
      <ScrollRestoration />
      <Outlet />
    </>
  );
};

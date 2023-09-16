import { Link, useSearch } from "@tanstack/react-router";
import { searchRoute } from "../router";

export const Search = () => {
  const params = useSearch({ from: searchRoute.to });
  return (
    <div>
      <h1>You searched:</h1>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      {params.pageIndex && (
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            disabled={params.pageIndex === 0}
            to={searchRoute.to}
            search={(prev) => {
              if (typeof prev.pageIndex === "number" && prev.pageIndex > 0) {
                return { ...prev, pageIndex: prev.pageIndex - 1 };
              }
              return prev;
            }}
          >
            Previous page
          </Link>
          <Link
            to={searchRoute.to}
            search={(prev) => {
              if (typeof prev.pageIndex === "number" && prev.pageIndex < 4) {
                return { ...prev, pageIndex: prev.pageIndex + 1 };
              }
              return prev;
            }}
          >
            Next page
          </Link>
        </div>
      )}
    </div>
  );
};

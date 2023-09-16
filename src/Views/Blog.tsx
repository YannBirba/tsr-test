import {
  Link,
  Outlet,
  useLoader,
  useMatch,
  useSearch,
} from "@tanstack/react-router";
import { newPostRoute, postRoute } from "../router";

export const Blog = () => {
  const { posts } = useLoader({
    from: "/blog-layout/blog",
  });
  const { userId } = useSearch({
    from: "/blog-layout/blog",
  });
  const { isFetching } = useMatch({ from: "/blog-layout/blog" });

  return (
    <div>
      <h3>Hello from the blog</h3> <Link to={newPostRoute.to}>New post</Link>
      <hr />
      <div>
        <details>
          <summary>Lire d'autres articles</summary>
          {isFetching ? (
            <div>Loading...</div>
          ) : (
            <ul
              style={{
                height: "350px",
                maxHeight: "100%",
                overflowY: "auto",
              }}
            >
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    activeProps={{
                      style: {
                        fontWeight: "bold",
                      },
                    }}
                    to={postRoute.to}
                    params={{
                      slug: `${post.title.replace(/\s/g, "-").toLowerCase()}-${
                        post.id
                      }`,
                    }}
                    search={{
                      userId,
                    }}
                  >
                    {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </details>

        <hr />
        <Outlet />
      </div>
    </div>
  );
};

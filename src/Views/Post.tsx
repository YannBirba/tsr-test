import { Link, useLoader, useMatch } from "@tanstack/react-router";
import { blogRoute } from "../router";

export const Post = () => {
  const { post } = useLoader({ from: "/blog-layout/blog/$slug" });
  const { isFetching } = useMatch({
    from: "/blog-layout/blog/$slug",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {isFetching ? (
        <div>Loading...</div>
      ) : (
        <>
          <h1>{post.title}</h1>
          <p
            dangerouslySetInnerHTML={{
              __html: post.body.replaceAll("\n", "<br />"),
            }}
          ></p>
          <hr />
          <Link to={blogRoute.to}>Back to blog</Link>
        </>
      )}
    </div>
  );
};

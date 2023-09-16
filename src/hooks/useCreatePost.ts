import {
  useBlocker,
  useNavigate,
  useRouter,
  useRouterContext,
} from "@tanstack/react-router";
import { useCallback } from "react";
import { Post, blogRoute, newPostRoute } from "../router";

export const useCreatePost = (validador: boolean) => {
  const router = useRouter();
  const context = useRouterContext({
    from: "/blog-layout/blog/new",
  });
  const navigate = useNavigate({
    from: newPostRoute.to,
    to: blogRoute.to,
  });
  useBlocker(
    "Vous avez des données non sauvegardées, voulez-vous vraiment quitter cette page ?",
    !validador
  );

  return useCallback(
    async (post: Omit<Post, "id">, target: HTMLFormElement) => {
      try {
        const response = await fetch(`${context.apiUrl}/posts`, {
          method: "POST",
          body: JSON.stringify(post),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors de la création du post");
        }
        navigate();

        if (validador) {
          router.invalidate();
          router.invalidate({
            matchId: "/file",
          });
          target.reset();
        }
      } catch (error) {
        throw new Error("Erreur lors de la création du post");
      }
    },
    [context.apiUrl, navigate, validador, router]
  );
};

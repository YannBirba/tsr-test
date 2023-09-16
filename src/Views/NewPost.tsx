import { useState } from "react";
import { useCreatePost } from "../hooks/useCreatePost";

export const NewPost = () => {
  const createPost = useCreatePost();

  const [isError, setIsError] = useState(false);
  const [block, setBlock] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLFormElement;
    e.preventDefault();

    const { title, body } = Object.fromEntries(
      new FormData(target).entries()
    ) as { title: string; body: string };

    try {
      await createPost(
        {
          title,
          body,
          userId: 1,
        },
        target
      );
    } catch (error) {
      setIsError(true);
    }
  };

  if (isError) throw new Error("Impossible de créer l'article");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3>Create a new post</h3>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <label htmlFor="title">Title</label>
        <input type="text" name="title" id="title" />
        <label htmlFor="body">Body</label>
        <textarea name="body" id="body"></textarea>
        <div>
          <input
            type="checkbox"
            name="block"
            id="block"
            checked={block}
            onChange={() => setBlock(!block)}
          />
          <label htmlFor="block">
            Test de bloquage de navigation après save
          </label>
        </div>

        <input type="submit" />
      </form>
    </div>
  );
};

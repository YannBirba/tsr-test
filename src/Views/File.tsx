import { useParams } from "@tanstack/react-router";
import { fileBaseRoute } from "../router";

export const File = () => {
  const params = useParams({ from: fileBaseRoute.to });
  return <p>Affichage du fichier {params["*"]}</p>;
};

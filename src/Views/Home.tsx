import { Await, useLoader } from "@tanstack/react-router";
import { Suspense } from "react";
import { homeRoute } from "../router";

export const Home = () => {
  const { slowData, fastData } = useLoader({
    from: homeRoute.to,
  });
  return (
    <div>
      <div>
        <Suspense fallback={<div>Loading slowData ...</div>}>
          <Await promise={slowData}>
            {(data) => {
              return <p>{data}</p>;
            }}
          </Await>
        </Suspense>
      </div>
      <div>
        <p>{fastData}</p>
      </div>
    </div>
  );
};

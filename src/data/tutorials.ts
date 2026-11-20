import tutoData from "./tutorials.json";

export type Tutorial = {
  id: string;
  name: string;
  tags: string[];
  image: string;
  path: string;
};

export const getTutorialById = (id: string) =>
  tutorials.find((p) => p.id === id);

export const tutorials: Tutorial[] = tutoData;

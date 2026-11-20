import type { Tutorial } from "../data/tutorials.ts";
import "./Tutocard.css";
import { asset } from "../utils/asset.ts";
import { Link } from "react-router";

type Tutocard = {
  tutorial: Pick<Tutorial, "id" | "name" | "tags" | "image" | "path">;
};

export const Tutocard = ({ tutorial }: Tutocard) => {
  return (
    <Link
      to={tutorial.path}
      key={tutorial.path}
      className="tuto-card-container"
    >
      <img src={asset(tutorial.image)} alt={`${tutorial.name}`} />
      <div className="tutorial-card-desc">
        <h5>{tutorial.name}</h5>
        <p>{tutorial.tags}</p>
      </div>
    </Link>
  );
};

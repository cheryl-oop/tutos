import type { Tutorial } from "../data/tutorials.ts";
import "./Tutocard.css";
import { asset } from "../utils/asset.ts";
import { Link } from "react-router";

type Tutocard = {
  tutorial: Pick<Tutorial, "id" | "name" | "tags" | "image" | "path">;
};

export const Tutocard = ({ tutorial }: Tutocard) => {
  return (
    <Link to={tutorial.path} className="tuto-card-container">
      <div className="tuto-card-img">
        <img src={asset(tutorial.image)} alt={`${tutorial.name}`} />
      </div>
      <div className="tutorial-card-desc">
        <h3>{tutorial.name}</h3>
        <div className="card-tags">
          {tutorial.tags.map((tags) => (
            <p key={tags}>{tags}</p>
          ))}
        </div>
      </div>
    </Link>
  );
};

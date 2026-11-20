import { tutorials } from "../data/tutorials";
import { Tutocard } from "../componenten/Tutocard.tsx";

export const Tutorials = () => {
  return (
    <>
      <section>
        <h2>Tutorials</h2>
        <p>Description</p>
      </section>
      <section className="tutorials-container">
        {tutorials.map((tutorial) => (
          <Tutocard key={tutorial.path} tutorial={tutorial} />
        ))}
      </section>
    </>
  );
};

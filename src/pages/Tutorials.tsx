import { tutorials } from "../data/tutorials";
import { Tutocard } from "../componenten/Tutocard.tsx";
import { Header } from "../componenten/Header.tsx";
import "./Tutorial.css";

export const Tutorials = () => {
  return (
    <>
      <Header />
      <section className="tutorials-section">
        <h2>Tutorials</h2>
        <p>
          These are the write-ups I make when something finally clicks or when
          it takes me three tries to understand. Pick a topic below!
        </p>
        <div className="tutorials-container">
          {tutorials.map((tutorial) => (
            <Tutocard key={tutorial.path} tutorial={tutorial} />
          ))}
        </div>
      </section>
    </>
  );
};

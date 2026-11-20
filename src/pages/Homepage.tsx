import { Link } from "react-router";
import "./Homepage.css";

export const Homepage = () => {
  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>Tutorials for dumdums</h1>
          <p>
            There's a gap between "I can use this" and "I actually understand
            this." This site lives in that gap. It's where I dig into the tricky
            parts of web development like the techniques, APIs, and patterns
            that are easy to use but hard to explain. I write them up until they
            make sense! Every tutorial here started as something I struggled
            with. If it helped me, chances are it'll help you.
          </p>
          <Link to="/tutorials">See tutorials</Link>
        </div>
      </section>
    </>
  );
};

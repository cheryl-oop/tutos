import { Link } from "react-router";

export const Homepage = () => {
  return (
    <>
      <section>
        <h1>Tutorials for dumdums</h1>
        <p>Description</p>
        <Link to="/tutorials">See tutorials</Link>
      </section>
    </>
  );
};

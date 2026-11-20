import { Link } from "react-router";

export const DatabaseIndex = () => {
  return (
    <>
      <Link to="/tutorials">← Terug</Link>
      <h1>Deep dive: Database Indexing & Query Optimization</h1>
      <h4> Why is my database so slow???</h4>
      <p>Intro.</p>
      <section className="problem">
        <h2>
          1.<span className="bold">The problem:</span> Why searching through
          thousands of rows is inefficient
        </h2>
      </section>
      <section className="indexes">
        <h2>
          2.<span className="bold">How indexes work:</span> B-trees, index
          lookups and full table scans.
        </h2>
      </section>
    </>
  );
};

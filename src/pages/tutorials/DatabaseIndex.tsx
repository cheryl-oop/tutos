import { Link } from "react-router";

export const DatabaseIndex = () => {
  return (
    <>
      <Link to="/tutorials">← Terug</Link>
      <h1>Deep dive: Database Indexing & Query Optimization</h1>
      <h4> Why is my database so slow???</h4>
      <p>
        An interactive exploration of MySQL indexes, query performance and
        execution plans.
      </p>
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
      <section className="test">
        <h2>
          3.<span className="bold">Test:</span> Without an index.
        </h2>
        <p>Run a query against a dataset and measure its performance.</p>
      </section>
      <section className="test">
        <h2>
          4.<span className="bold">Test:</span> Now with an index.
        </h2>
        <p>Add an index and compare the results.</p>
      </section>
      <section className="explain">
        <h2>
          5.<span className="bold">Understandig:</span> EXPLAIN Analyze.
        </h2>
      </section>
      <section className="explain">
        <h2>
          6.<span className="bold">Composite indexes:</span> column order
          affects index usage.
        </h2>
      </section>
    </>
  );
};

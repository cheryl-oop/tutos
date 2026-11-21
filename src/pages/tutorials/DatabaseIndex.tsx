import { useState } from "react";
import { Link } from "react-router";
import "./DatavaseIndex.css";

type BenchmarkResult = {
  success: boolean;
  error?: string;
  user: {
    id: number;
    username: string;
    email: string;
    city: string;
    created_at: string;
  } | null;
  execution_time_ms: number;
  found: boolean;
};
const API_URL = "http://localhost:8000/api";

export const DatabaseIndex = () => {
  const [email, setEmail] = useState("user_042000@example.com");
  const [withoutIndex, setWithoutIndex] = useState<BenchmarkResult | null>(
    null,
  );
  const [withIndex, setWithIndex] = useState<BenchmarkResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const runBenchmark = async (enabled: boolean) => {
    setLoading(true);
    setError("");

    try {
      // Choose which table to query.
      const mode = enabled ? "indexed" : "unindexed";

      // Execute the benchmark query.
      const response = await fetch(
        `${API_URL}/benchmark.php?email=${encodeURIComponent(email)}&mode=${mode}`,
      );

      const data: BenchmarkResult = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "The benchmark query failed.");
      }

      if (enabled) {
        setWithIndex(data);
      } else {
        setWithoutIndex(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const speedDifference =
    withoutIndex && withIndex
      ? withoutIndex.execution_time_ms - withIndex.execution_time_ms
      : null;

  const improvement =
    withoutIndex && withIndex && withoutIndex.execution_time_ms > 0
      ? ((withoutIndex.execution_time_ms - withIndex.execution_time_ms) /
          withoutIndex.execution_time_ms) *
        100
      : null;

  return (
    <main>
      <Link to="/tutorials">← Terug</Link>

      <h1>Deep dive: Database Indexing & Query Optimization</h1>
      <p>
        When a database has a few rows, finding a record feels so fast enough
        that you never think about it. But grow that table to thousands or
        millions of rows and suddenly the same query crawls. What changed?
      </p>
      <p>
        Without an index, MySQL may have to examine every single row in the
        table to find what you're looking for. That's called a full table scan,
        and it's the thing quietly killing your query performance! In this
        tutorial we'll look at how indexes help MySQL find data faster, compare
        query performance with and without one, and use MySQL's execution plans
        to see what's actually happening behind the scenes. And maybe when a
        query feels slow next time, you'll know exactly where to look.
      </p>
      <section className="problem">
        <h2>0. Before we start</h2>
        <p>
          Before starting this tutorial, the reader should have:
          <ul>
            <li> Basic knowledge of SQL</li>
            <li>Basic knowledge of SELECT queries.</li>
            <li> Understanding what tables, rows and columns are.</li>
            <li>
              A MySQL database environment.
              <span>
                (Tip: You can use MySQL Workbench, but you will need a MySQL
                server!)
              </span>
            </li>
          </ul>
        </p>
      </section>

      <section className="problem">
        <h2>
          1. <span className="bold">The problem:</span> Why searching through
          thousands of rows is inefficient
        </h2>
        <img src="" />
        <p>
          Picture a users table with 100,000 rows, and you're hunting for one
          specific person. If there's no index on the column you're searching,
          MySQL has no shortcut! It has to check row after row until it finds a
          match.<span className="highlight">That's a full table scan.</span>
        </p>

        <p>
          It works, sure. But the cost scales with the table: 100 rows could be
          alright, but 100,000 will slow things down...by a lot! And table
          that's queried constantly pays that cost every single time.
        </p>
        <p>
          This is the problem <span className="highlight">indexes</span> solve.
          Instead of reading every row, an index lets the database jump much
          closer to the data it needs. So let's see how it works!
        </p>
      </section>

      <section className="indexes">
        <h2>
          2. <span className="bold">How indexes work:</span> B-trees, index
          lookups and full table scans.
        </h2>
      </section>

      <section className="test">
        <h2>
          3. <span className="bold">Test:</span> Without an index.
        </h2>

        <p>
          Run the same query with and without an index on the email column and
          compare the results!
        </p>

        <div className="benchmark-panel">
          <label htmlFor="email">Email to search</label>
          <p>Search from user_000000@example.com to user_999999@example.com </p>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <div className="benchmark-buttons">
            <button
              onClick={() => runBenchmark(false)}
              disabled={loading || !email}
            >
              Run without index
            </button>

            <button
              onClick={() => runBenchmark(true)}
              disabled={loading || !email}
            >
              Run with index
            </button>
          </div>

          {loading && <p>Running benchmark...</p>}

          {error && <p className="error">{error}</p>}

          <div className="benchmark-results">
            <div className="result-card">
              <h4>Without index</h4>

              {withoutIndex ? (
                <>
                  <p className="result-time">
                    {withoutIndex.execution_time_ms} ms
                  </p>

                  <p>
                    {withoutIndex.found
                      ? `Found: ${withoutIndex.user?.username}`
                      : "User not found"}
                  </p>
                </>
              ) : (
                <p>Run the benchmark to see the result.</p>
              )}
            </div>

            <div className="result-card">
              <h4>With index</h4>

              {withIndex ? (
                <>
                  <p className="result-time">
                    {withIndex.execution_time_ms} ms
                  </p>

                  <p>
                    {withIndex.found
                      ? `Found: ${withIndex.user?.username}`
                      : "User not found"}
                  </p>
                </>
              ) : (
                <p>Run the benchmark to see the result.</p>
              )}
            </div>
          </div>

          {improvement !== null && speedDifference !== null && (
            <div className="comparison-summary">
              <h4>Comparison</h4>
              <p>
                {improvement >= 0
                  ? `${improvement.toFixed(1)}% less execution time with the index.`
                  : `${Math.abs(improvement).toFixed(1)}% more execution time with the index.`}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="explain">
        <h2>
          4. <span className="bold">Understanding:</span> EXPLAIN ANALYZE.
        </h2>
      </section>

      <section className="explain">
        <h2>
          5. <span className="bold">Composite indexes:</span> column order
          affects index usage.
        </h2>
      </section>
    </main>
  );
};

import { useState } from "react";
import { Link } from "react-router";

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
    <>
      <Link to="/tutorials">← Terug</Link>

      <h1>Deep dive: Database Indexing & Query Optimization</h1>
      <h4>Why is my database so slow???</h4>

      <p>
        An interactive exploration of MySQL indexes, query performance and
        execution plans.
      </p>

      <section className="problem">
        <h2>
          1. <span className="bold">The problem:</span> Why searching through
          thousands of rows is inefficient
        </h2>
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
          compare the results.
        </p>

        <div className="benchmark-panel">
          <label htmlFor="email">Email to search</label>

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
              <h3>Without index</h3>

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
              <h3>With index</h3>

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
              <h3>Comparison</h3>

              <p>
                {speedDifference >= 0
                  ? `The indexed query was ${speedDifference.toFixed(3)} ms faster.`
                  : `The indexed query was ${Math.abs(speedDifference).toFixed(3)} ms slower in this run.`}
              </p>

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
    </>
  );
};

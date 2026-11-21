import { useState } from "react";
import { Link } from "react-router";
import { asset } from "../../utils/asset";
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
const API_URL = import.meta.env.VITE_API_URL;

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
    <main className="main">
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
        <img src={asset("/images/index.svg")} />
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
        <p>
          A database index is a data structure that lets MySQL find records
          without examining every row. The classic comparison is the index at
          the <span className="highlight">back of a book</span>: instead of
          reading every page, you look up a keyword and jump straight to the
          right page.
        </p>
        <h4>What it's replacing</h4>
        <p>
          Without a suitable index, MySQL falls back to examining every row to
          find a match, a full table scan. For a small table that's fine, but as
          the table grows, so does the work. With an index, MySQL uses that
          organized structure to go straight to the matching record, examining{" "}
          far fewer rows and data pages along the way. It has a
          <span className="highlight">O(log n)</span> performance for a reason!
          (Full scan has an performance of On)
        </p>
        <h4>B-tree indexes</h4>
        <img src={asset("/images/b-tree.png")} />
        <p>
          In MySQL's InnoDB engine, indexes are usually built as{" "}
          <span className="highlight">B-trees</span>
          (technically B+ trees). They keep indexed values in sorted order,
          which is what makes the shortcut possible: instead of searching every
          record one by one, MySQL walks down a handful of tree levels and lands
          on the right entry.
        </p>
      </section>

      <section className="test">
        <h2>3. Test: Let's try it out!.</h2>
        <img src={asset("/images/building-two.png")} />
        <p>
          I set up two tables with the same 100,000 fictional users. Both have a
          primary key on id but only one has a{" "}
          <span className="highlight">secondary index </span> on email.
        </p>

        <p>
          This allows us to compare how MySQL retrieves a user when the email
          column is indexed and when it is not. Enter an email address and run
          both benchmarks to compare the execution times.
        </p>

        <p>
          Each benchmark executes the query 15 times and reports the median
          execution time. Using the median reduces the influence of unusually
          slow or fast individual measurements (like cache for example).
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
        <h4>What the results tell us</h4>
        <p>
          Execution times show that the index helped but not why. The next
          section uses <span className="highlight">EXPLAIN ANALYZE</span> to
          look at the actual execution plan and see what MySQL is doing behind
          the scenes.
        </p>
      </section>

      <section className="explain">
        <h2>
          4. <span className="bold">Understanding:</span> EXPLAIN ANALYZE.
        </h2>
        <p>
          The benchmark tells you how long a query takes but not how MySQL gets
          the data. For that, you inspect the execution plan with{" "}
          <span className="highlight">EXPLAIN</span>.
        </p>
        <p>
          EXPLAIN shows{" "}
          <span className="highlight">how MySQL plans to run a query</span>:
          which table it accesses, which index it picks (if any), and how it
          expects to retrieve the rows. Also including timing and row counts for
          individual operations in the execution plan. Quite handy!
        </p>
        <h4>Without Index</h4>
        <p>
          <p>
            Because the email column has no secondary index in this table, MySQL
            may perform a full table scan. In the execution plan, this is
            commonly indicated by the access type ALL.
          </p>
        </p>
        <img src={asset("/images/without.png")} />

        <h4>With index</h4>
        <img src={asset("/images/with.png")} />
        <p>
          In the indexed table, MySQL can use the email index to locate the
          matching record. The execution plan may show an access type such as
          ref or const, depending on the query and optimizer decisions.
        </p>
        <p>
          The key column shows which index MySQL selected. By comparing both
          execution plans, we can see how the presence of an index changes the
          access method.
        </p>
      </section>

      <section className="explain">
        <h2>
          5. <span className="bold">*Little Bonus* Composite indexes:</span>{" "}
          column order affects index usage.
        </h2>

        <p>
          So far every index we've looked at covers a single column. But real
          queries often filter on several columns at once and that's where a{" "}
          {""}
          <span className="highlight">composite index</span> comes in.
        </p>
        <img src={asset("/images/comp.jpeg")} />
        <p>
          A composite index is an index built across multiple columns. The order
          you define them in matters, because MySQL can only use the index
          starting from its <span className="highlight"> leftmost</span>{" "}
          columns. Think of it like a phone book sorted by last name, then first
          name: you can look someone up by last name, or by last name and first
          name but not by first name alone.
        </p>
      </section>
      <section className="explain">
        <h2>
          5. <span className="bold">Are indexes always beneficial?</span>
        </h2>
        <p>
          Indexes aren't free. Every one you add takes up storage, and MySQL has
          to keep it up to date as rows are inserted, deleted, or updated. It's
          extra work on every write that touches an indexed column.
        </p>
        <p>
          So more indexes isn't automatically better. Pile on too many and your
          writes get slower and your storage bill grows, often for indexes
          nothing actually uses. The rule of thumb: index for the queries you
          actually run, not for every column that looks important.
        </p>
      </section>
      <section className="conclusion">
        <h2>6. Conclusion: When should you use an index?</h2>

        <p>
          Indexes make reads faster by shrinking the amount of data MySQL has to
          examine but they cost you on writes and storage. That's the whole
          trade-off in one line.
        </p>
        <p>
          So the question isn't "should I add an index?" but "does this index
          serve a query I actually run?" Check with EXPLAIN: if you see a full
          table scan on a query that matters, an index is probably worth it. If
          nothing's using the index, it's just slowing down your writes.
        </p>
        <p>
          Anyways, the key takeaway is that database optimization is not simply
          about adding indexes everywhere! With this understanding about how
          MySQL retrieves your data, you can make your own call!
        </p>
      </section>
    </main>
  );
};

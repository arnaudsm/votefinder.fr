import data from "../data/data.json";

export default function ResultsDeputes({ results }) {
  return (
    <div className="list">
      <div className="explanation">
        Pourcentage d’accord avec les députés français sortants.
        <br />
        Trié par accords - désaccords.
      </div>
      {results.deputes
        .sort(
          ([id_a], [id_b]) =>
            results?.deputesRaw?.[id_b]?.["+"] -
            results?.deputesRaw?.[id_b]?.["-"] -
            (results?.deputesRaw?.[id_a]?.["+"] -
              results?.deputesRaw?.[id_a]?.["-"]),
        )
        .map(([id, approval]) => (
          <a
            className="result"
            href={`https://www.assemblee-nationale.fr/dyn/deputes/${id}`}
            key={id}
            target="_blank"
          >
            <img
              src={`/deputes/${id.slice(2)}.jpg`}
              alt={data.deputes[id]?.l}
            />
            <div className="progress">
              <div
                className="bar"
                style={{ width: `${Math.floor(approval * 100)}%` }}
              ></div>
              <div className="name">
                <h4>{data.deputes[id]?.l}</h4>
                <div>
                  {results?.deputesRaw?.[id]?.["+"]}/
                  {results?.deputesRaw?.[id]?.["+"] +
                    results?.deputesRaw?.[id]?.["-"]}{" "}
                  votes
                </div>
              </div>
              <div className="score">{`${Math.floor(approval * 100)}%`}</div>
            </div>
          </a>
        ))}
    </div>
  );
}

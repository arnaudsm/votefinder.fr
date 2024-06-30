import data from "../data/data.json";

export default function ResultsDeputes({ results }) {
  return (
    <div className="ResultsDeputes">
      <div className="ResultsDeputes__explanation">
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
            className="Result Result--simple"
            href={`https://www.assemblee-nationale.fr/dyn/deputes/${id}`}
            key={id}
            target="_blank"
          >
            <div className="Result__img-container">
              <img
                className="Result__img"
                src={`${import.meta.env.BASE_URL}deputes/${id.slice(2)}.jpg`}
                alt={data.deputes[id]?.l}
              />
            </div>
            <div className="Result__progress">
              <div
                className="Result__bar"
                style={{ width: `${Math.floor(approval * 100)}%` }}
              ></div>
              <div className="Result__name">
                <h4>{data.deputes[id]?.l}</h4>
                <div className="Result__ratio">
                  {results?.deputesRaw?.[id]?.["+"]}/
                  {results?.deputesRaw?.[id]?.["+"] +
                    results?.deputesRaw?.[id]?.["-"]}{" "}
                  votes
                </div>
              </div>
              <div className="Result__score">{`${Math.floor(approval * 100)}%`}</div>
            </div>
          </a>
        ))}
    </div>
  );
}

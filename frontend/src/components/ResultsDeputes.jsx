import data from "../data/data.json";

export default function ResultsDeputes({ results }) {
  const getRatio = (id) => {
    const positive = results?.deputesRaw?.[id]?.["+"] || 0;
    const negative = results?.deputesRaw?.[id]?.["-"] || 0;

    if (negative === 0 && positive > 0) return Number.POSITIVE_INFINITY;
    if (negative === 0 && positive === 0) return -Number.POSITIVE_INFINITY;
    if (positive === 0) return -1;

    return positive / negative;
  };

  const deputesRatioSort = ([id_a], [id_b]) => {
    return getRatio(id_b) - getRatio(id_a);
  };

  const deputesVotesSort = ([id_a], [id_b]) => {
    const ratio_a = getRatio(id_a);
    const ratio_b = getRatio(id_b);

    if (ratio_a === ratio_b) {
      const sum_a =
        (results?.deputesRaw?.[id_a]?.["+"] || 0) +
        (results?.deputesRaw?.[id_a]?.["-"] || 0);
      const sum_b =
        (results?.deputesRaw?.[id_b]?.["+"] || 0) +
        (results?.deputesRaw?.[id_b]?.["-"] || 0);
      return sum_b - sum_a;
    }

    return 0;
  };

  return (
    <div className="ResultsDeputes">
      <div className="ResultsDeputes__explanation">
        Pourcentage d’accord avec les députés français sortants.
        <br />
        Trié par accords - désaccords.
      </div>
      {results.deputes
        .sort(([id_a], [id_b]) => {
          return deputesRatioSort([id_a], [id_b]);
        })
        .sort(([id_a], [id_b]) => {
          return deputesVotesSort([id_a], [id_b]);
        })
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

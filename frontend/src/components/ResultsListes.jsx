import ResultListe from "./ResultListe";
import data from "../data/data.json";

export default function ResultsListes({ results, choices }) {
  const vote_length = Object.keys(data.votes).length;
  const choices_length = Object.keys(choices).length;

  return (
    <div className="ResultsListes">
      <p className="ResultsListes__explanation">
        Pourcentage d’accord avec les listes sortantes.
        <br />
        Calculé sur {choices_length} votes sur les {vote_length} disponibles.
        {choices_length < vote_length && (
          <> Continuez à voter pour affiner vos résultats !</>
        )}
      </p>
      {results.lists.map(([id, approval]) => (
        <ResultListe id={id} approval={approval} key={id} />
      ))}
    </div>
  );
}

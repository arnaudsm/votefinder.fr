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
        Calculé sur {choices_length} votes.{" "}
        {choices_length < vote_length ? (
          <strong>
            Il en reste {vote_length - choices_length}, continuez à voter pour
            affiner vos résultats !
          </strong>
        ) : (
          <strong>Bravo, vous avez complété tous les votes ! 🎉</strong>
        )}
      </p>
      {results.lists.map(([id, approval]) => (
        <ResultListe id={id} approval={approval} key={id} />
      ))}
    </div>
  );
}

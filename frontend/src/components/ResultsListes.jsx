import ResultListe from "./ResultListe";

export default function ResultsListes({ results, choices }) {
  return (
    <div className="list">
      <div className="explanation">
        Pourcentage d’accord avec les listes sortantes.
        <br />
        Calculé sur {Object.keys(choices).length} votes. Continuez à voter pour
        affiner vos résultats.
      </div>
      {results.lists.map(([id, approval]) => (
        <ResultListe id={id} approval={approval} key={id} />
      ))}
    </div>
  );
}

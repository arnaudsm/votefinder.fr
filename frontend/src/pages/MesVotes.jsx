import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";
import Card from "../components/Card.jsx";

export default function MesVotes() {
  const context = useContext(ThemeContext);
  const choices = Object.keys(context.choices).filter(
    (vote_id) => vote_id in data.votes,
  );

  useEffect(() => {
    context.contentRef.current.scrollTo(0, 0);
  }, [context.contentRef]);

  return (
    <div className={`MesVotes`}>
      <h1 className="MesVotes__title title">Mes votes</h1>
      <div className="MesVotes__results">
        {choices.map((vote_id) => (
          <Card vote_id={vote_id} key={vote_id} editable />
        ))}
        {choices.length == 0 && (
          <div className="MesVotes__empty">
            {"Vous n'avez voté pour aucun texte pour l'instant !"}
          </div>
        )}
      </div>
    </div>
  );
}

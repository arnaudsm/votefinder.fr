import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";
import Card from "../components/Card.jsx";

export default function MesVotes({ visible }) {
  const context = useContext(ThemeContext);
  const choices = Object.keys(context.choices).filter(
    (vote_id) => vote_id in data.votes,
  );

  return (
    <div className={`MesVotes ${visible ? "" : "hide"}`}>
      <div className="ResultsParVote">
        {choices.map((vote_id) => (
          <Card vote_id={vote_id} key={vote_id} editable />
        ))}
        {choices.length == 0 && (
          <div className="list">
            {"Vous n'avez voté pour aucun texte pour l'instant !"}
          </div>
        )}
      </div>
    </div>
  );
}

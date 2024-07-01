import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";
import Card from "../components/Card.jsx";
import { Button } from "@mui/material";
import { FileDownload } from "@mui/icons-material";

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
      <div className="MesVotes__header">
        <h1 className="MesVotes__title title">Mes votes</h1>
        <Button
          className="Btn Btn--secondary"
          startIcon={<FileDownload />}
          size="large"
          variant="contained"
          onClick={() => {
            const data = new Blob([JSON.stringify(context.choices)], {
              type: "application/json",
            });
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "votes_legislatives.txt";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          disableElevation
        >
          Télécharger
        </Button>
      </div>

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

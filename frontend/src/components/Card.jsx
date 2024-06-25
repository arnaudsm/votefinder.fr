import data from "../data/data.json";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Article, BarChart, Folder, QuestionAnswer } from "@mui/icons-material";
import { formatDate } from "../utils/utils.jsx";
import ListVote from "./ListVote";

export default function Card({ vote_id, list_id, editable }) {
  const vote = data.votes[vote_id];
  const context = useContext(ThemeContext);

  return (
    <div className="Card">
      <div className="Card__top">
        <h2>{vote.titre}</h2>
        <ul>
          <li>{vote.sous_titre_1}</li>
          <li>{vote.sous_titre_2}</li>
        </ul>
      </div>
      <div className="Card__bottom">
        {!list_id && (
          <div className="Card__meta">
            {formatDate(vote.date)} - {vote.type}
          </div>
        )}

        {list_id && (
          <div className="Card__results">
            {vote && <ListVote vote_id={vote_id} list_id={list_id} />}

            <div className="Card__user-vote">
              <span>Vous avez voté : </span>
              <strong>
                {
                  {
                    "-": "👎 Contre",
                    0: "Passer",
                    "+": "👍 Pour",
                  }[context.choices[vote_id]]
                }
              </strong>
            </div>
          </div>
        )}
        {!list_id && (
          <>
            <div className="Card__actions">
              {vote.dossier_url && (
                <Button
                  startIcon={<Folder />}
                  className="Card__more-info"
                  color="lightBlue"
                  variant="contained"
                  disableElevation
                  target="_blank"
                  href={vote.dossier_url}
                >
                  Dossier
                </Button>
              )}
              {vote.debat_url && (
                <Button
                  startIcon={<QuestionAnswer />}
                  className="Card__more-info"
                  color="lightBlue"
                  variant="contained"
                  disableElevation
                  target="_blank"
                  href={vote.debat_url}
                >
                  Débat
                </Button>
              )}
              {vote.summary_url && (
                <Button
                  startIcon={<Article />}
                  className="Card__more-info"
                  color="lightBlue"
                  variant="contained"
                  disableElevation
                  target="_blank"
                  href={vote.summary_url}
                >
                  Résumé
                </Button>
              )}
            </div>
            <Button
              startIcon={<BarChart />}
              className="Card__more-info"
              color="lightBlue"
              variant="contained"
              disableElevation
              target="_blank"
              onClick={() => context.setStatsPopup(vote.vote_id)}
            >
              Votes des partis
            </Button>
          </>
        )}
        {editable && (
          <ToggleButtonGroup
            className="Card__toggle-group"
            value={context.choices[vote_id]}
            exclusive
            fullWidth={true}
            onChange={(event) =>
              context.choose({
                vote_id,
                type: event.target.value,
                noPopup: true,
              })
            }
          >
            <ToggleButton value="-">👎 Contre</ToggleButton>
            <ToggleButton value="0">Passer</ToggleButton>
            <ToggleButton value="+">👍 Pour</ToggleButton>
          </ToggleButtonGroup>
        )}
      </div>
    </div>
  );
}

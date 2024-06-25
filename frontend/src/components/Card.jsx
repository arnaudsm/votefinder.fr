import data from "../data/data.json";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Diversity3 } from "@mui/icons-material";
import { formatDate } from "../utils/utils.jsx";
import ListVote from "./ListVote";

export default function Card({ vote_id, list_id, editable }) {
  const vote = data.votes[vote_id];
  const context = useContext(ThemeContext);

  return (
    <div className="Card">
      <div className="Card__top">
        {!list_id && (
          <div className="Card__meta">
            {formatDate(vote.date)} - {vote.type}
          </div>
        )}

        <h2 className="Card__title">{vote.titre}</h2>
        <ul>
          <li>{vote.sous_titre_1}</li>
          <li>{vote.sous_titre_2}</li>
        </ul>
      </div>
      <div className="Card__bottom">
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
              <Button
                className="Card__btn"
                disableElevation
                target="_blank"
                onClick={() => {}} // @TODO : affichage à l'arrière de la carte
              >
                {/* eslint-disable-next-line react/no-unescaped-entities */}+
                d'infos
              </Button>

              <Button
                startIcon={<Diversity3 />}
                className="Card__btn"
                disableElevation
                target="_blank"
                onClick={() => context.setStatsPopup(vote.vote_id)}
              >
                Votes des partis
              </Button>

              {/*              {vote.dossier_url && (
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
              )}*/}
            </div>
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

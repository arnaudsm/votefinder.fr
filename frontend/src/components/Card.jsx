import data from "../data/data.json";
import { useContext, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import {
  Diversity3,
  StickyNote2,
  Article,
  QuestionAnswer,
  Sync,
} from "@mui/icons-material";
import { formatDate } from "../utils/utils.jsx";
import ListVote from "./ListVote";
import CrossIcon from "../assets/icons/cross.svg";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

export default function Card({ vote_id, list_id, is_votes_page, editable }) {
  const vote = data.votes[vote_id];
  const context = useContext(ThemeContext);
  const cardRef = useRef(null);

  return (
    <div ref={cardRef} className={`Card ${editable ? "Card--editable" : ""}`}>
      <div className="Card__front">
        <div className="Card__container">
          <div className="Card__bg"></div>
          {is_votes_page && (
            <>
              <div className="Card__bg Card__bg--approve"></div>
              <div className="Card__bg Card__bg--decline"></div>
            </>
          )}
          <div className="Card__top">
            {!list_id && (
              <div className="Card__meta">
                {formatDate(vote.date)} - {vote.type}
              </div>
            )}

            <h2 className="Card__title">{vote.titre}</h2>
            <ul className="Card__subtitles">
              <li className="Card__subtitle">• {vote.sous_titre_1}</li>
              <li className="Card__subtitle">• {vote.sous_titre_2}</li>
            </ul>
          </div>
          <div className="Card__bottom">
            {list_id && (
              <div className="Card__results">
                {vote && <ListVote vote_id={vote_id} list_id={list_id} />}

                <div className="Card__user-vote user-vote">
                  <span>Vous avez voté : </span>

                  <div className="user-vote__icon">
                    {
                      {
                        "-": <ThumbDownIcon />,
                        0: <CrossIcon />,
                        "+": <ThumbUpIcon />,
                      }[context.choices[vote_id]]
                    }
                  </div>

                  <strong className="user-vote__label">
                    {
                      {
                        "-": "Contre",
                        0: "Passer",
                        "+": "Pour",
                      }[context.choices[vote_id]]
                    }
                  </strong>
                </div>
              </div>
            )}
            {!list_id && (
              <div className="Card__actions">
                <Button
                  className="Card__btn Btn Btn--white Btn--bordered Btn--transparent"
                  disableElevation
                  target="_blank"
                  onClick={() => {
                    cardRef.current.classList.add("Card--revert");
                  }}
                >
                  {/* eslint-disable-next-line react/no-unescaped-entities */}+
                  d'infos
                </Button>

                <Button
                  startIcon={<Diversity3 />}
                  className="Card__btn Btn Btn--white"
                  disableElevation
                  target="_blank"
                  onClick={() => context.setStatsPopup(vote.vote_id)}
                >
                  Votes des partis
                </Button>
              </div>
            )}
          </div>
        </div>

        {editable && (
          <div className="Card__toggle-container">
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
              <ToggleButton value="-">
                <ThumbDownIcon /> Contre
              </ToggleButton>
              <ToggleButton value="0">
                <CrossIcon /> Passer
              </ToggleButton>
              <ToggleButton value="+">
                <ThumbUpIcon /> Pour
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        )}
      </div>
      <div className="Card__back">
        <div className="Card__container">
          <div className="Card__bg"></div>
          {is_votes_page && (
            <>
              <div className="Card__bg Card__bg--approve"></div>
              <div className="Card__bg Card__bg--decline"></div>
            </>
          )}
          <div className="Card__top">
            {!list_id && (
              <div className="Card__meta">
                {formatDate(vote.date)} - {vote.type}
              </div>
            )}

            <h2 className="Card__title">{vote.titre}</h2>

            <div className="Card__back-content">
              {/*@TODO : mettre une description du type de projet*/}

              <div className="Card__actions">
                {vote.summary_url && (
                  <Button
                    startIcon={<StickyNote2 />}
                    className="Card__btn Btn Btn--white"
                    color="secondary"
                    variant="contained"
                    disableElevation
                    target="_blank"
                    href={vote.summary_url}
                  >
                    Texte résumé
                  </Button>
                )}
                {vote.dossier_url && (
                  <Button
                    startIcon={<Article />}
                    className="Card__btn Btn Btn--white"
                    color="secondary"
                    variant="contained"
                    disableElevation
                    target="_blank"
                    href={vote.dossier_url}
                  >
                    Texte complet
                  </Button>
                )}
                {vote.debat_url && (
                  <Button
                    startIcon={<QuestionAnswer />}
                    className="Card__btn Btn Btn--white"
                    color="secondary"
                    variant="contained"
                    disableElevation
                    target="_blank"
                    href={vote.debat_url}
                  >
                    {/* eslint-disable-next-line react/no-unescaped-entities */}
                    Les débats à l'assemblée
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="Card__bottom">
            {!list_id && (
              <div className="Card__actions">
                <Button
                  startIcon={<Sync />}
                  className="Card__btn Btn Btn--white Btn--large Btn--bordered Btn--transparent"
                  disableElevation
                  target="_blank"
                  onClick={() => {
                    cardRef.current.classList.remove("Card--revert");
                  }}
                >
                  Retour
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

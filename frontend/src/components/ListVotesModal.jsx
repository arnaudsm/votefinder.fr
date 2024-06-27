import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";
import { Button, SwipeableDrawer } from "@mui/material";
import Card from "./Card.jsx";
import { AccountBalance, Close } from "@mui/icons-material";

export default function ListVotesModal() {
  const context = useContext(ThemeContext);
  const choices = Object.keys(context.choices).filter(
    (vote_id) => vote_id in data.votes,
  );

  return (
    <SwipeableDrawer
      anchor="top"
      open={Boolean(context.listVotesPopup)}
      onClose={() => context.setListVotesPopup(false)}
      className="ListVotesModal TopModal"
    >
      <div className="content">
        <div className="MesVotes">
          <div className="MesVotes__results">
            {choices.map((vote_id) => (
              <Card
                vote_id={vote_id}
                key={vote_id}
                list_id={context.listVotesPopup}
              />
            ))}
            {choices.length == 0 && (
              <div>{"Vous n'avez voté pour aucun texte pour l'instant !"}</div>
            )}
          </div>
        </div>
      </div>
      <div className="ListVotesModal__actions">
        <h2 className="TopModal__title">
          {data.lists[context.listVotesPopup]?.label}
        </h2>
        <Button
          startIcon={<AccountBalance />}
          className="Btn Btn--purple"
          color="secondary"
          variant="contained"
          size="large"
          href={`https://www.assemblee-nationale.fr/dyn/org/${context.listVotesPopup}`}
          target="_blank"
          disableElevation
        >
          Fiche du parti
        </Button>
        <Button
          className="Btn Btn--purple Btn--bordered"
          startIcon={<Close />}
          variant="text"
          disableElevation
          onClick={() => context.setListVotesPopup(false)}
        >
          Fermer
        </Button>
      </div>
    </SwipeableDrawer>
  );
}

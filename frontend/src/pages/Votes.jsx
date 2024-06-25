import { useContext, useState } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";
import Card from "../components/Card.jsx";
import { Button, Stack } from "@mui/material";
import { CardSwiper } from "react-card-swiper";
import NoVotesLeft from "../components/NoVotesLeft.jsx";
import Contre from "../assets/icons/contre.svg";
import Pour from "../assets/icons/pour.svg";
import { shuffle } from "../utils/utils";
import { recommendedVotesCount } from "../data/variables";

export default function Votes({ visible }) {
  const vote_ids = shuffle(Object.keys(data.votes));
  const context = useContext(ThemeContext);
  const [id, setId] = useState();
  const [unseen_vote_ids] = useState(
    vote_ids
      .filter((vote_id) => !context.choices[vote_id])
      .sort(
        (a, b) =>
          Number(data.votes?.[a]?.pinned || false) -
          Number(data.votes?.[b]?.pinned || false),
      ),
  );
  const handleDismiss = (el, meta, id, action, operation) => {
    if (operation !== "swipe") return;
    context.choose({ vote_id: id, type: action == "like" ? "+" : "-" });
  };
  const handleEnter = (el, meta, id) => setId(id);
  const cardData = unseen_vote_ids.map((vote_id) => ({
    id: vote_id,
    content: <Card vote_id={vote_id} />,
  }));
  const progress = Math.floor(
    (Object.keys(context.choices).length / recommendedVotesCount) * 100,
  );
  return (
    <div className={`Votes ${visible ? "" : "hide"}`}>
      {progress < 100 && (
        <div className="Votes__progress progress">
          <div
            className="progress__bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
      <Stack className="Votes__stack">
        <CardSwiper
          className="Votes__card-swiper"
          data={cardData}
          onEnter={handleEnter}
          onFinish={() => null}
          onDismiss={handleDismiss}
          dislikeButton={<div />}
          likeButton={<div />}
          withActionButtons
          withRibbons
          likeRibbonText="POUR"
          dislikeRibbonText="CONTRE"
          ribbonColors={{
            bgLike: "#63B85D",
            bgDislike: "#DD5A5A",
            textColor: "white",
          }}
          emptyState={<NoVotesLeft />}
        />
      </Stack>
      <div className="Votes__actions actions">
        <Button
          variant="contained"
          disableElevation
          color="highlight"
          className="actions__contre"
          onClick={() => {
            context.choose({ vote_id: id, type: "-" });
            document
              .getElementById("swipe-card__dislike-action-button")
              ?.click();
          }}
        >
          <Contre />
          Contre
        </Button>
        <Button
          variant="contained"
          disableElevation
          color="highlight"
          className="actions__passer"
          onClick={() => {
            context.choose({ vote_id: id, type: "0" });
            document
              .getElementById("swipe-card__dislike-action-button")
              ?.click();
          }}
        >
          Passer
        </Button>
        <Button
          variant="contained"
          disableElevation
          color="highlight"
          className="actions__pour"
          onClick={() => {
            context.choose({ vote_id: id, type: "+" });
            document.getElementById("swipe-card__like-action-button")?.click();
          }}
        >
          <Pour />
          Pour
        </Button>
      </div>
    </div>
  );
}

import { useContext, useState, useEffect, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";
import Card from "../components/Card.jsx";
import { Button, Stack } from "@mui/material";
import { CardSwiper } from "react-card-swiper";
import NoVotesLeft from "../components/NoVotesLeft.jsx";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { shuffle } from "../utils/utils";
import { recommendedVotesCount } from "../data/variables";
import CrossIcon from "../assets/icons/cross.svg";

export default function Votes({ visible }) {
  let currentSwipeCardRef = useRef(null);
  let currentCardRef = useRef(null);
  const actionContreRef = useRef(null);
  const actionPasserRef = useRef(null);
  const actionPourRef = useRef(null);

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
    context.choose({ vote_id: id, type: action === "like" ? "+" : "-" });
  };
  const handleEnter = (el, meta, id) => {
    setId(id);
    currentSwipeCardRef.current = el;
    currentCardRef.current = el.querySelector(".Card");
  };
  const cardData = unseen_vote_ids.map((vote_id) => ({
    id: vote_id,
    content: <Card vote_id={vote_id} />,
  }));
  const progress = Math.floor(
    (Object.keys(context.choices).length / recommendedVotesCount) * 100,
  );

  return (
    <div className={`Votes ${visible ? "" : "hide"}`}>
      <div className="Votes__bg-color"></div>
      <div className="Votes__bg-circle"></div>

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
            bgLike: "var(--mui-palette-green-main)",
            bgDislike: "var(--mui-palette-red-main)",
            textColor: "white",
          }}
          emptyState={<NoVotesLeft />}
        />
      </Stack>
      <div className="Votes__actions actions">
        <Button
          disableElevation
          className="actions__contre"
          ref={actionContreRef}
          onClick={() => {
            context.choose({ vote_id: id, type: "-" });
            document
              .getElementById("swipe-card__dislike-action-button")
              ?.click();
          }}
        >
          <ThumbDownIcon color="red" />
        </Button>

        <Button
          disableElevation
          className="actions__passer"
          ref={actionPasserRef}
          onClick={() => {
            context.choose({ vote_id: id, type: "0" });
            document
              .getElementById("swipe-card__dislike-action-button")
              ?.click();
          }}
        >
          <CrossIcon />
        </Button>

        <Button
          disableElevation
          className="actions__pour"
          ref={actionPourRef}
          onClick={() => {
            context.choose({ vote_id: id, type: "+" });
            document.getElementById("swipe-card__like-action-button")?.click();
          }}
        >
          <ThumbUpIcon color="green" />
        </Button>
      </div>

      {progress < 100 && (
        <div className="Votes__progress progress">
          <div
            className="progress__bar"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}

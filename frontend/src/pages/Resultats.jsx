import { useContext, useMemo, useState, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { getRanks } from "../utils/votes.jsx";
import { minVotesCount } from "../data/variables.jsx";
import { Button, Tab, Tabs } from "@mui/material";
import { Share } from "@mui/icons-material";
import ResultsListes from "../components/ResultsListes.jsx";
import ResultsDeputes from "../components/ResultsDeputes.jsx";
import html2canvas from "html2canvas";
export default function Resultats() {
  const [tab, setTab] = useState(0);
  const context = useContext(ThemeContext);
  const results = useMemo(() => getRanks(context.choices), [context.choices]);
  const minVotesReached = Object.keys(context.choices).length >= minVotesCount;
  const handleChange = (event, newValue) => setTab(newValue);

  useEffect(() => {
    context.contentRef.current.scrollTo(0, 0);
  }, [context.contentRef]);

  return (
    <div className={`Resultats`}>
      <div className="Resultats__header">
        <h1 className="title">Mes Résultats</h1>

        {minVotesReached && navigator.canShare && (
          <Button
            startIcon={<Share />}
            color="secondary"
            variant="contained"
            className="Resultats__share Btn Btn--purple"
            onClick={async () => {
              context.setShowShare(true);
              await share();
              context.setShowShare(false);
            }}
            disabled={context.showShare}
            disableElevation
          >
            Partager
          </Button>
        )}
      </div>

      <div className="Resultats__container">
        <Tabs
          className="Resultats__tabs"
          value={tab}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          <Tab className="Resultats__tab" label="Listes" />
          <Tab className="Resultats__tab" label="Députés" />
        </Tabs>
        {!minVotesReached ? (
          <div className="Resultats__list">
            Réponds à plus de {minVotesCount} questions pour voir tes résultats!
          </div>
        ) : tab == 0 ? (
          <ResultsListes results={results} choices={context.choices} />
        ) : tab == 1 ? (
          <ResultsDeputes results={results} />
        ) : null}
      </div>
    </div>
  );
}

async function share() {
  try {
    await new Promise((r) => setTimeout(r, 800));
    const canvas = await html2canvas(document.querySelector(".SharePopup"));
    canvas.toBlob(async (blob) => {
      const files = [new File([blob], "image.png", { type: blob.type })];
      const shareData = {
        text: "https://votefinder.fr",
        title: "Mes meilleurs candidats aux Législatives d'après VoteFinder.fr",
        files,
      };
      if (navigator.canShare && navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          console.error(err);
        }
      } else {
        console.warn("Sharing not supported", shareData);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

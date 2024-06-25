import { useContext, useMemo, useState } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { getRanks } from "../utils/votes.jsx";
import { minVotes } from "../data/variables.jsx";
import { Button, Tab, Tabs } from "@mui/material";
import { Share } from "@mui/icons-material";
import ResultsListes from "../components/ResultsListes.jsx";
import ResultsDeputes from "../components/ResultsDeputes.jsx";
import html2canvas from "html2canvas";
export default function Resultats({ visible }) {
  const [tab, setTab] = useState(0);
  const context = useContext(ThemeContext);
  const results = useMemo(() => getRanks(context.choices), [context.choices]);
  const minVotesReached = Object.keys(context.choices).length >= minVotes;
  const handleChange = (event, newValue) => setTab(newValue);

  return (
    <div className={`Resultats ${visible ? "" : "hide"}`}>
      <div className="Resultats__header">
        <h2>🏆 Mes Résultats</h2>

        {minVotesReached && navigator.canShare && (
          <Button
            startIcon={<Share />}
            color="primary"
            variant="contained"
            className="Resultats__share"
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
      <Tabs
        className="Resultats__tabs"
        value={tab}
        onChange={handleChange}
        variant="fullWidth"
      >
        <Tab label="Listes" />
        <Tab label="Députés" />
      </Tabs>
      {!minVotesReached ? (
        <div className="Resultats__list">
          Réponds à plus de {minVotes} questions pour voir tes résultats!
        </div>
      ) : tab == 0 ? (
        <ResultsListes results={results} choices={context.choices} />
      ) : tab == 1 ? (
        <ResultsDeputes results={results} />
      ) : null}
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

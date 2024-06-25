import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";
import { Button, SwipeableDrawer } from "@mui/material";
import { getListsVotes } from "../utils/votes.jsx";
import { Close } from "@mui/icons-material";

export default function StatsModal() {
  const context = useContext(ThemeContext);
  const vote = data.votes?.[context.statsPopup];

  return (
    <SwipeableDrawer
      anchor="top"
      open={Boolean(context.statsPopup)}
      onClose={() => context.setStatsPopup(false)}
      className="StatsModal"
    >
      <div className="content">
        <h2>{vote?.titre}</h2>
        <ul>
          <li>{vote?.sous_titre_1}</li>
          <li>{vote?.sous_titre_2}</li>
        </ul>
        <div className="results">
          {vote &&
            Object.entries(getListsVotes(vote?.votes))
              .filter(([, results]) => !Number.isNaN(results["-%"]))
              .map(([id, results]) => (
                <div className="result" key={id}>
                  <div className="progress">
                    <div
                      className="bar pour"
                      style={{
                        width: `${Math.floor(results["+%"] * 100)}%`,
                      }}
                    ></div>
                    <div
                      className="bar contre"
                      style={{
                        width: `${Math.floor(results["-%"] * 100)}%`,
                        marginLeft: `${Math.floor(results["+%"] * 100)}%`,
                      }}
                    ></div>
                    <div className="name">
                      <h4>{data.lists[id].label}</h4>
                      <h5>{data.lists[id].leader}</h5>
                    </div>
                    <div className="score">
                      {`${Math.floor(results["+"])} pour`}
                      <br />
                      {`${Math.floor(results["-"])} contre`}
                      <br />
                      {`${Math.floor(results["0"])} abs`}
                    </div>
                  </div>
                </div>
              ))}
        </div>
        <Button
          endIcon={<Close />}
          variant="text"
          disableElevation
          onClick={() => context.setStatsPopup(false)}
        >
          Fermer
        </Button>
      </div>
    </SwipeableDrawer>
  );
}

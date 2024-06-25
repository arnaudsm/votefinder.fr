import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Button } from "@mui/material";
import { AccountBalance } from "@mui/icons-material";
import { projectURL } from "../data/variables.jsx";

export default function Welcome() {
  const context = useContext(ThemeContext);

  return (
    <div className="Welcome">
      <div className="Welcome__container">
        <div className="Welcome__card">
          <div className="Welcome__top">
            <h2>{"Votez les textes de l'Assemblée Nationale 🏛️🇫🇷"}</h2>
          </div>
          <div className="Welcome__bottom">
            <h2>Et découvrez quel parti a voté comme vous✌️</h2>
            <Button
              className="Welcome__start"
              color="lightRed"
              variant="contained"
              disableElevation
              onClick={() => {
                localStorage.setItem("started", "y");
                context.setStarted(true);
              }}
            >
              Commencer
            </Button>
          </div>
        </div>
        <div className="Welcome__footer">
          Textes issus de la 16<sup>ème</sup> législature (2022-2024).
          <br />
          Résumés non-exhaustifs, cliquez pour plus de contexte !
          <br />
          <br />
          VoteFinder est un projet bénévole,{" "}
          <a href={projectURL} target="_blank">
            open-source
          </a>
          , et sans tracking.
          <br />
          <br />
          <div className="Welcome__datan">
            {
              "Retrouvez plus d'informations et d'actualités de l'Assemblée Nationale chez notre partenaire"
            }
            <Button
              target="_blank"
              href="https://datan.fr/"
              endIcon={<AccountBalance />}
            >
              Datan.fr
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

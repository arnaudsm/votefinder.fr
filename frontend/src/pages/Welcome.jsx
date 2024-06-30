import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { projectURL } from "../data/variables.jsx";
import { Button } from "@mui/material";
import { East } from "@mui/icons-material";

import WelcomeIllustrationPath from "../assets/images/welcome-illustration.svg";

export default function Welcome() {
  const context = useContext(ThemeContext);

  useEffect(() => {
    context.contentRef.current.scrollTo(0, 0);
  }, [context.contentRef]);

  return (
    <div className="Welcome">
      <div className="Welcome__container">
        <div className="Welcome__illustration">
          <img src={WelcomeIllustrationPath} alt="Welcome illustration" />
        </div>

        <div className="Welcome__content">
          <strong>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Votez les textes de l'Assemblée Nationale (2022 - 2024), et
            découvrez quel parti a voté comme vous !
          </strong>

          <p>
            VoteFinder est un projet bénévole,{" "}
            <a href={projectURL} target="_blank">
              open-source
            </a>
            , et sans tracking.
          </p>
        </div>
      </div>

      <div className="Welcome__bottom">
        <Button
          className="Welcome__btn Btn Btn--body"
          color="background"
          variant="contained"
          endIcon={<East />}
          disableElevation
          onClick={() => {
            localStorage.setItem("started", "y");
            context.setStarted(true);
          }}
        >
          Commencer
        </Button>
      </div>

      <div className="Welcome__bg-circle"></div>
    </div>
  );
}

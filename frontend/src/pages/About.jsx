import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Button } from "@mui/material";
import {
  Delete,
  Email,
  GitHub,
  Instagram,
  Description,
  X,
} from "@mui/icons-material";
import EuropeIcon from "../assets/icons/europe.svg";
import { projectURL } from "../data/variables.jsx";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";

import TiktokIcon from "../assets/icons/tiktok.svg";

export default function About() {
  const context = useContext(ThemeContext);

  useEffect(() => {
    context.contentRef.current.scrollTo(0, 0);
  }, [context.contentRef]);

  return (
    <div className={`About`}>
      <div className="About__container">
        <h1 className="About__title title">À Propos</h1>

        <div className="About__section">
          <p>
            VoteFinder est un projet bénévole,
            <br />
            <a href={projectURL} target="_blank">
              open-source
            </a>
            , et sans tracking.
          </p>

          <p>
            Les textes proposés sont issus
            <br />
            de la 16<sup>ème</sup> législature (2022-2024).
            <br />
            <br />
            Résumés non-exhaustifs,
            <br />
            cliquez pour plus de contexte !
          </p>

          <Button
            startIcon={<Description />}
            className="About__btn Btn Btn--secondary"
            variant="contained"
            size="large"
            href="Communique-de-Presse-VoteFinder.fr.pdf"
            disableElevation
          >
            communiqué de presse
          </Button>
        </div>

        <div className="About__section">
          <h2 className="About__subtitle">🚀 Contribuer</h2>
          <p>
            Vous voulez corriger une erreur
            <br />
            ou rajouter un texte de loi ?
          </p>
          <p>
            Contactez-nous ou proposez
            <br />
            une modification sur GitHub !
          </p>

          <Button
            startIcon={<Email />}
            className="About__btn Btn Btn--secondary"
            variant="contained"
            size="large"
            href="mailto:contact@votefinder.fr"
            disableElevation
          >
            nous contacter
          </Button>
          <Button
            startIcon={<GitHub />}
            className="About__btn Btn Btn--secondary"
            variant="contained"
            size="large"
            disableElevation
            href={projectURL}
            target="_blank"
          >
            contribuer sur github
          </Button>
        </div>

        <div className="About__section">
          <h2 className="About__subtitle">🔗 Réseaux sociaux</h2>
          <div className="About__socials">
            <Button
              className="About__btn Btn Btn--secondary"
              variant="contained"
              href="https://twitter.com/VoteFinder_eu"
            >
              <X />
            </Button>
            <Button
              className="About__btn Btn Btn--secondary"
              variant="contained"
              href="https://www.instagram.com/votefinder.eu"
            >
              <Instagram />
            </Button>
            <Button
              className="About__btn Btn Btn--secondary"
              variant="contained"
              href="https://www.tiktok.com/@votefinder.eu"
            >
              <TiktokIcon />
            </Button>
          </div>
        </div>

        <div className="About__section">
          <h2 className="About__subtitle">⚙️ Paramètres</h2>
          <div className="About__theme-switcher">
            Choix du thème
            <ThemeSwitcher />
          </div>

          <Button
            className="About__btn Btn Btn--secondary"
            startIcon={<Delete />}
            size="large"
            variant="contained"
            onClick={() => {
              if (!confirm("Voulez vous supprimer toutes vos données locales?"))
                return;
              context.setChoices({});
              localStorage.setItem("votes", JSON.stringify({}));
              context.acceptWelcome(false);
              context.setTab(0);
            }}
            disableElevation
          >
            Réinitialiser mes votes
          </Button>
        </div>

        <div className="About__section">
          <h2 className="About__subtitle">🔍 Nos autres projets</h2>
          <Button
            className="About__btn Btn Btn--secondary"
            variant="contained"
            size="large"
            disableElevation
            href="https://votefinder.eu"
            target="_blank"
            startIcon={<EuropeIcon />}
          >
            Votefinder Européennes
          </Button>
        </div>

        <div className="About__section">
          <h2 className="About__subtitle">👥 L’équipe</h2>

          <div className="About__team">
            <div>
              <strong>Arnaud de Saint Méloir</strong> - Créateur/Ingénieur
            </div>

            <div>
              <strong>Anna Logacheva</strong> - Communication
            </div>

            <div>
              <strong>Yeliz Inci</strong> - Spécialiste Droits Humains
            </div>

            <div>
              <strong>Rémi Dupont</strong> - Communication
            </div>

            <div>
              <strong>Arnaud-Yoh Massenet</strong> - Data Scientist
            </div>

            <div>
              <strong>Mélusine Magat</strong> - Communication et Relecture
            </div>

            <div>
              <strong>Marie-Bénédicte Fradin</strong> - Communication et
              Relecture
            </div>

            <div>
              <strong>Cyprien Olive-Riban</strong> - Relecture
            </div>

            <div>
              <strong>Clément Gayot</strong> - Développeur
            </div>

            <div>
              <strong>Tiphaine Chomaz</strong> - Designer UX / UI
            </div>
          </div>
        </div>

        <div className="About__section">
          <h2 className="About__subtitle">🤝 Partenaires</h2>

          <div className="About__team">
            <div>
              <strong>Théo Delemazure</strong> -{" "}
              <a href="https://theatrebourbon.delemazure.fr/">
                Plateforme des débats
              </a>
            </div>

            <div>
              <strong>Awenig Marié</strong> -{" "}
              <a href="https://datan.fr/">Datan.fr</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

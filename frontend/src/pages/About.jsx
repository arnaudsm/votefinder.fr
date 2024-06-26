import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Button } from "@mui/material";
import {
  Delete,
  Email,
  FileDownload,
  GitHub,
  Instagram,
  PictureAsPdf,
  X,
} from "@mui/icons-material";
import { projectURL } from "../data/variables.jsx";
import ThemeSwitcher from "../components/ThemeSwitcher.jsx";

export default function About({ visible }) {
  const context = useContext(ThemeContext);

  return (
    <div className={`About ${visible ? "" : "hide"}`}>
      <div className="About__card">
        <h2>À Propos</h2>
        <p>
          VoteFinder est un projet bénévole, <br />
          open-source, et sans tracking.
        </p>

        <Button
          startIcon={<PictureAsPdf />}
          color="primary"
          variant="contained"
          size="large"
          href="Communique-de-Presse-VoteFinder.fr.pdf"
          disableElevation
        >
          communiqué de presse
        </Button>
        <p>
          Vous voulez corriger une erreur ou rajouter un texte de loi ?<br />
          Contactez-nous ou proposez une modification sur GitHub !
        </p>
        <Button
          startIcon={<Email />}
          color="primary"
          variant="contained"
          size="large"
          href="mailto:contact@votefinder.fr"
          disableElevation
        >
          nous contacter
        </Button>
        <Button
          startIcon={<GitHub />}
          color="primary"
          variant="contained"
          size="large"
          disableElevation
          href={projectURL}
          target="_blank"
        >
          contribuer sur github
        </Button>
        <Button
          color="primary"
          variant="contained"
          size="large"
          href="https://votefinder.eu"
        >
          VoteFinder Européennes
        </Button>

        <h2>Paramètres</h2>
        <div>
          Choix du thème
          <ThemeSwitcher />
        </div>

        <Button
          className="reset"
          startIcon={<Delete />}
          size="large"
          color="primary"
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
          réinitialiser mes votes
        </Button>
        <Button
          className="reset"
          startIcon={<FileDownload />}
          size="large"
          color="primary"
          variant="contained"
          onClick={() => {
            const data = new Blob([JSON.stringify(context.choices)], {
              type: "application/json",
            });
            const url = window.URL.createObjectURL(data);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            a.download = "votes_legislatives.txt";
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          }}
          disableElevation
        >
          Télécharger mes votes
        </Button>

        <h2>Réseaux Sociaux</h2>
        <div className="About__socials">
          <Button
            color="primary"
            variant="contained"
            href="https://twitter.com/VoteFinder_eu"
            startIcon={<X />}
          >
            Twitter
          </Button>
          <Button
            color="primary"
            variant="contained"
            href="https://www.instagram.com/votefinder.eu"
            startIcon={<Instagram />}
          >
            instagram
          </Button>
          <Button
            color="primary"
            variant="contained"
            href="https://www.tiktok.com/@votefinder.eu"
          >
            TikTok
          </Button>
        </div>

        <h2>L’Équipe</h2>
        <div className="About__team">
          <div style={{ width: "80%" }}>
            <h4>Arnaud de Saint Méloir</h4>
            <h5>Créateur/Ingénieur</h5>
          </div>
          <div>
            <h4>Anna Logacheva</h4>
            <h5>Communication</h5>
          </div>
          <div>
            <h4>Yeliz Inci</h4>
            <h5>Spécialiste Droits Humains</h5>
          </div>
          <div>
            <h4>Rémi Dupont</h4>
            <h5>Communication</h5>
          </div>
          <div>
            <h4>Arnaud-Yoh Massenet</h4>
            <h5>Data Scientist</h5>
          </div>
          <div>
            <h4>Mélusine Magat</h4>
            <h5>Communication et Relecture</h5>
          </div>

          <div>
            <h4>Marie-Bénédicte Fradin</h4>
            <h5>Communication et Relecture</h5>
          </div>

          <div>
            <h4>Cyprien Olive-Riban</h4>
            <h5>Relecture</h5>
          </div>

          <div>
            <h4>Clément Gayot</h4>
            <h5>Développeur</h5>
          </div>

          <div>
            <h4>Tiphaine Chomaz</h4>
            <h5>Designer UX / UI</h5>
          </div>
        </div>
        <h2>Remerciements</h2>
        <div className="About__team">
          <div>
            <h4>Théo Delemazure</h4>
            <h5>
              <a target="_blank" href="https://theatrebourbon.delemazure.fr/">
                Plateforme des débats
              </a>
            </h5>
          </div>
          <div>
            <h4>Awenig Marié</h4>
            <h5>
              <a target="_blank" href="https://datan.fr/">
                Datan.fr
              </a>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
}

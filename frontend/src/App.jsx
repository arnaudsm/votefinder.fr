import data from "./data";
import { useState, useMemo, useContext, createContext } from "react";
import "./index.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import {
  BottomNavigation,
  BottomNavigationAction,
  AppBar,
  Toolbar,
  Button,
  Stack,
  ThemeProvider,
  Tab,
  Tabs,
  Modal,
  ToggleButtonGroup,
  ToggleButton,
  SwipeableDrawer,
} from "@mui/material";
import {
  HowToVote,
  EmojiEvents,
  Info,
  Delete,
  Email,
  GitHub,
  Share,
  Close,
  PictureAsPdf,
  AccountBalance,
  X,
  Instagram,
  Article,
  Folder,
  BarChart,
  ViewStream,
  QuestionAnswer,
  FileDownload,
} from "@mui/icons-material";
import LogoURL from "./icons/logo_url.svg";
import Pour from "./icons/pour.svg";
import Contre from "./icons/contre.svg";
import Trophy from "./icons/trophy.svg";
import { CardSwiper } from "react-card-swiper";
import ConfettiExplosion from "react-confetti-explosion";
import { calculateResults, calculateVote } from "./rank";
import { theme } from "./theme";
import html2canvas from "html2canvas";

const shuffle = (arr) => {
  const newArr = arr.slice();
  for (let i = newArr.length - 1; i > 0; i--) {
    const rand = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[rand]] = [newArr[rand], newArr[i]];
  }
  return newArr;
};

const vote_ids = shuffle(Object.keys(data.votes));
const minVotes = 5;
const recommendedVotes = Object.values(data.votes).filter(
  (x) => x.pinned,
).length;
const enableResultsPopup = false;
const projectURL = "https://github.com/arnaudsm/votefinder.fr";

const formatDate = (txt) => {
  if (!txt) return "";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "long",
    }).format(new Date(txt));
  } catch (error) {
    console.log(error);
  }
  return txt;
};

const Card = ({ vote_id, list_id, editable }) => {
  const vote = data.votes[vote_id];
  const context = useContext(Context);

  return (
    <div className="Card">
      <div className="top">
        <h2>{vote.titre}</h2>
        <ul>
          <li>{vote.sous_titre_1}</li>
          <li>{vote.sous_titre_2}</li>
        </ul>
      </div>
      <div className="bottom">
        <div className="meta">
          {formatDate(vote.date)} - {vote.type}
        </div>
        {list_id && (
          <div className="results">
            {vote &&
              Object.entries(calculateVote(vote?.votes))
                .filter(
                  ([id, results]) =>
                    id === list_id && !Number.isNaN(results["-%"]),
                )
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
        )}

        {!list_id && (
          <div className="actions">
            {vote.dossier_url && (
              <Button
                startIcon={<Folder />}
                className="more-info"
                color="lightBlue"
                variant="contained"
                disableElevation
                target="_blank"
                href={vote.dossier_url}
              >
                Dossier
              </Button>
            )}
            {vote.debat_url && (
              <Button
                startIcon={<QuestionAnswer />}
                className="more-info"
                color="lightBlue"
                variant="contained"
                disableElevation
                target="_blank"
                href={vote.debat_url}
              >
                Débat
              </Button>
            )}
            {vote.summary_url && (
              <Button
                startIcon={<Article />}
                className="more-info"
                color="lightBlue"
                variant="contained"
                disableElevation
                target="_blank"
                href={vote.summary_url}
              >
                Résumé
              </Button>
            )}
          </div>
        )}

        {!list_id && (
          <Button
            startIcon={<BarChart />}
            className="more-info"
            color="lightBlue"
            variant="contained"
            disableElevation
            target="_blank"
            onClick={() => context.setStatsPopup(vote.vote_id)}
          >
            Votes des partis
          </Button>
        )}

        {list_id && (
          <div>
            <span>Vous avez voter : </span>
            <strong>
              {context.choices[vote_id] === "-"
                ? "👎 Contre"
                : context.choices[vote_id] === "0"
                  ? "Passer"
                  : context.choices[vote_id] === "+"
                    ? "👍 Pour"
                    : ""}
            </strong>
          </div>
        )}

        {editable && (
          <ToggleButtonGroup
            value={context.choices[vote_id]}
            exclusive
            fullWidth={true}
            onChange={(event) =>
              context.choose({
                vote_id,
                type: event.target.value,
                noPopup: true,
              })
            }
          >
            <ToggleButton value="-">👎 Contre</ToggleButton>
            <ToggleButton value="0">Passer</ToggleButton>
            <ToggleButton value="+">👍 Pour</ToggleButton>
          </ToggleButtonGroup>
        )}
      </div>
    </div>
  );
};

function BottomNav({ state: [tab, setTab] }) {
  return (
    <BottomNavigation
      className="BottomNav"
      showLabels
      value={tab}
      onChange={(event, newValue) => setTab(newValue)}
    >
      {[
        { key: "votes", label: "Voter", icon: <HowToVote /> },
        { key: "resultats", label: "Résultats", icon: <EmojiEvents /> },
        { key: "mes-votes", label: "Mes Votes", icon: <ViewStream /> },
        { key: "a-propos", label: "À Propos", icon: <Info /> },
      ].map(({ label, icon, key }) => (
        <BottomNavigationAction label={label} icon={icon} key={key} />
      ))}
    </BottomNavigation>
  );
}

const NoVotesLeft = () => {
  const context = useContext(Context);

  return (
    <div className="NoVotesLeft">
      <div> Félicitations, vous avez voté toutes les lois !</div>
      <Button
        className="welcome-start"
        variant="contained"
        disableElevation
        size="large"
        onClick={() => {
          context.setTab(1);
          context.setResultPopup(false);
        }}
      >
        voir mes résultats
      </Button>
    </div>
  );
};

const Votes = ({ visible }) => {
  const context = useContext(Context);
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
    (Object.keys(context.choices).length / recommendedVotes) * 100,
  );
  return (
    <div className={`Votes ${visible ? "" : "hide"}`}>
      {progress < 100 && (
        <div className="progress">
          <div className="bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}
      <Stack className="Stack">
        <CardSwiper
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
      <div className="actions">
        <Button
          variant="contained"
          disableElevation
          color="secondary"
          className="contre"
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
          color="secondary"
          className="passer"
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
          color="secondary"
          className="pour"
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
};

const Navbar = () => (
  <AppBar position="static" color="inherit" className="Navbar">
    <Toolbar color="white">
      <a href="https://votefinder.fr">
        <LogoURL className="logo" />
      </a>
    </Toolbar>
  </AppBar>
);

const Welcome = () => {
  const context = useContext(Context);

  return (
    <>
      <div className="Welcome">
        <div className="Card">
          <div className="top">
            <h2>{"Votez les textes de l'Assemblée Nationale 🏛️🇫🇷"}</h2>
          </div>
          <div className="bottom">
            <h2>Et découvrez quel parti a voté comme vous✌️</h2>
            <Button
              className="welcome-start"
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
        <div className="footer">
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
        </div>
      </div>
    </>
  );
};

const share = async () => {
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
};

const ResultListe = ({ id, approval }) => {
  // const [open, setOpen] = useState(false);
  const context = useContext(Context);

  return (
    <a
      className="liste-result"
      key={id}
      onClick={() => {
        context.setListVotesPopup(id);
        document.querySelector(".ListVotesModal .content").scrollTo(0, 0);
      }}
    >
      <div className="top">
        <img src={`/lists/${id}.svg`} alt={data.lists[id].label} />
        <div className="progress">
          <div
            className="bar"
            style={{ width: `${Math.floor(approval * 100)}%` }}
          ></div>
          <div className="name">
            <h4>{data.lists[id].label}</h4>
            <h5>{data.lists[id].leader}</h5>
          </div>
          <div className="score">
            {data.lists[id].etranger ? "* " : ""}
            {data.lists[id].no_data
              ? "Non Sortant"
              : `${Math.floor(approval * 100)}%`}
          </div>
        </div>
      </div>
    </a>
  );
};
const ResultsListes = ({ results, choices }) => (
  <div className="list">
    <div className="explanation">
      Pourcentage d’accord avec les listes sortantes.
      <br />
      Calculé sur {Object.keys(choices).length} votes. Continuez à voter pour
      affiner vos résultats.
    </div>
    {results.lists.map(([id, approval]) => (
      <ResultListe id={id} approval={approval} key={id} />
    ))}
  </div>
);

const ResultsDeputes = ({ results }) => {
  return (
    <div className="list">
      <div className="explanation">
        Pourcentage d’accord avec les députés français sortants.
        <br />
        Trié par accords - désaccords.
      </div>
      {results.deputes
        .sort(
          ([id_a], [id_b]) =>
            results?.deputesRaw?.[id_b]?.["+"] -
            results?.deputesRaw?.[id_b]?.["-"] -
            (results?.deputesRaw?.[id_a]?.["+"] -
              results?.deputesRaw?.[id_a]?.["-"]),
        )
        .map(([id, approval]) => (
          <a
            className="result"
            href={`https://www.assemblee-nationale.fr/dyn/deputes/${id}`}
            key={id}
            target="_blank"
          >
            <img
              src={`/deputes/${id.slice(2)}.jpg`}
              alt={data.deputes[id]?.l}
            />
            <div className="progress">
              <div
                className="bar"
                style={{ width: `${Math.floor(approval * 100)}%` }}
              ></div>
              <div className="name">
                <h4>{data.deputes[id]?.l}</h4>
                <div>
                  {results?.deputesRaw?.[id]?.["+"]}/
                  {results?.deputesRaw?.[id]?.["+"] +
                    results?.deputesRaw?.[id]?.["-"]}{" "}
                  votes
                </div>
              </div>
              <div className="score">{`${Math.floor(approval * 100)}%`}</div>
            </div>
          </a>
        ))}
    </div>
  );
};

const Resultats = ({ visible }) => {
  const [tab, setTab] = useState(0);
  const context = useContext(Context);
  const results = useMemo(
    () => calculateResults(context.choices),
    [context.choices],
  );
  const minVotesReached = Object.keys(context.choices).length >= minVotes;
  const handleChange = (event, newValue) => setTab(newValue);

  return (
    <div className={`Resultats ${visible ? "" : "hide"}`}>
      <div className="header">
        <h2>🏆 Mes Résultats</h2>

        {minVotesReached && navigator.canShare && (
          <Button
            startIcon={<Share />}
            color="primary"
            variant="contained"
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
      <Tabs value={tab} onChange={handleChange} variant="fullWidth">
        <Tab label="Listes" />
        <Tab label="Députés" />
      </Tabs>
      {!minVotesReached ? (
        <div className="list">
          Réponds à plus de {minVotes} questions pour voir tes résultats!
        </div>
      ) : tab == 0 ? (
        <ResultsListes results={results} choices={context.choices} />
      ) : tab == 1 ? (
        <ResultsDeputes results={results} />
      ) : null}
    </div>
  );
};

const About = ({ visible }) => {
  const context = useContext(Context);

  return (
    <div className={`About ${visible ? "" : "hide"}`}>
      <div className="Card">
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
        <div className="socials">
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
        <div className="equipe">
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
        </div>
        <h2>Remerciements</h2>
        <div className="equipe" style={{ width: "80%" }}>
          <div style={{ width: "80%" }}>
            <h4>Théo Delemazure</h4>
            <h5>
              <a href="https://theatrebourbon.delemazure.fr/">
                Plateforme des débats
              </a>
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

const Context = createContext({});

const ResultsModal = () => {
  const context = useContext(Context);
  return (
    <Modal
      open={context.resultPopup}
      onClose={() => context.setResultPopup(false)}
      className="ResultsModal"
    >
      <div className="content">
        <h2>Vous avez voté assez de lois pour découvrir vos résultats !</h2>
        <ConfettiExplosion zIndex="1400" />
        <Trophy />
        <div className="actions">
          <Button
            className="welcome-start"
            variant="white"
            disableElevation
            size="large"
            onClick={() => {
              context.setResultPopup(false);
            }}
          >
            Continuer à voter
          </Button>
          <Button
            className="welcome-start"
            color="lightRed"
            variant="contained"
            disableElevation
            size="large"
            onClick={() => {
              context.setTab(1);
              context.setResultPopup(false);
            }}
          >
            Mes résultats
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const StatsModal = () => {
  const context = useContext(Context);
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
            Object.entries(calculateVote(vote?.votes))
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
};

const ListVotesModal = () => {
  const context = useContext(Context);
  const choices = Object.keys(context.choices).filter(
    (vote_id) => vote_id in data.votes,
  );

  return (
    <SwipeableDrawer
      anchor="top"
      open={Boolean(context.listVotesPopup)}
      onClose={() => context.setListVotesPopup(false)}
      className="ListVotesModal"
    >
      <div className="content">
        <Button
          startIcon={<AccountBalance />}
          color="secondary"
          variant="contained"
          size="large"
          href={`https://www.assemblee-nationale.fr/dyn/org/${context.listVotesPopup}`}
          target="_blank"
          disableElevation
        >
          Présentation du parti
        </Button>

        <div className="MesVotes">
          <div className="ResultsParVote">
            {choices.map((vote_id) => (
              <Card
                vote_id={vote_id}
                key={vote_id}
                list_id={context.listVotesPopup}
              />
            ))}
            {choices.length == 0 && (
              <div className="list">
                {"Vous n'avez voté pour aucun texte pour l'instant !"}
              </div>
            )}
          </div>
        </div>

        <Button
          endIcon={<Close />}
          variant="text"
          disableElevation
          onClick={() => context.setListVotesPopup(false)}
        >
          Fermer
        </Button>
      </div>
    </SwipeableDrawer>
  );
};

const SharePopup = () => {
  const context = useContext(Context);
  const results = useMemo(
    () => calculateResults(context.choices),
    [context.choices],
  );
  return (
    <div className="SharePopup">
      <h1>{"Les partis qui votent comme moi à l'Assemblée Nationale 🏛️🇫🇷"}</h1>
      <div className="list">
        <div className="explanation">Pourcentage de votes d’accord</div>
        {results.lists.slice(0, 4).map(([id, approval]) => (
          <a
            className="result"
            href={`https://www.assemblee-nationale.fr/dyn/org/${id}`}
            key={id}
            target="_blank"
          >
            <img src={`/lists/${id}.jpg`} alt={data.lists[id].label} />
            <div className="progress">
              <div
                className="bar"
                style={{ width: `${Math.floor(approval * 100)}%` }}
              ></div>
              <div className="name">
                <h4>{data.lists[id].label}</h4>
                <h5>{data.lists[id].leader}</h5>
              </div>
              <div className="score">{`${Math.floor(approval * 100)}%`}</div>
            </div>
          </a>
        ))}
      </div>
      <LogoURL className="logo" />
    </div>
  );
};

const MesVotes = ({ visible }) => {
  const context = useContext(Context);
  const choices = Object.keys(context.choices).filter(
    (vote_id) => vote_id in data.votes,
  );

  return (
    <div className={`MesVotes ${visible ? "" : "hide"}`}>
      <div className="ResultsParVote">
        {choices.map((vote_id) => (
          <Card vote_id={vote_id} key={vote_id} editable />
        ))}
        {choices.length == 0 && (
          <div className="list">
            {"Vous n'avez voté pour aucun texte pour l'instant !"}
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [tab, setTab] = useState(0);
  const [resultPopup, setResultPopup] = useState();
  const [listVotesPopup, setListVotesPopup] = useState();
  const [statsPopup, setStatsPopup] = useState();
  const [showShare, setShowShare] = useState();
  const [showConfetti, setConfetti] = useState(true);
  const [choices, setChoices] = useState(() => {
    const json = localStorage.getItem("votes");
    if (!json) return {};
    return JSON.parse(json);
  });
  const [started, setStarted] = useState(
    localStorage.getItem("started") == "y",
  );
  const choose = ({ vote_id, type, noPopup }) => {
    setChoices((prevChoices) => {
      const newChoices = { ...prevChoices, [vote_id]: type };
      localStorage.setItem("votes", JSON.stringify(newChoices));
      if (Object.keys(newChoices).length == recommendedVotes && !noPopup) {
        if (!enableResultsPopup) setTab(1);
        setResultPopup(true);
      }
      return newChoices;
    });
  };
  const acceptWelcome = (value) => {
    setStarted(value);
    localStorage.setItem("started", value ? "y" : "");
  };

  return (
    <ThemeProvider theme={theme}>
      <Context.Provider
        value={{
          tab,
          setTab,
          choices,
          choose,
          setChoices,
          setStarted,
          acceptWelcome,
          resultPopup,
          setResultPopup,
          listVotesPopup,
          setListVotesPopup,
          showShare,
          setShowShare,
          statsPopup,
          setStatsPopup,
        }}
      >
        <Navbar />
        {/* Switch with CSS to keep the state and rendering */}
        <div className="content">
          {!enableResultsPopup && resultPopup && showConfetti && (
            <ConfettiExplosion
              onComplete={() => {
                setConfetti(false);
              }}
            />
          )}
          {started ? (
            <>
              <Votes visible={tab == 0} />
              <Resultats visible={tab == 1} />
              <MesVotes visible={tab == 2} />
              <About visible={tab == 3} />
            </>
          ) : (
            <Welcome />
          )}
        </div>
        {showShare && <SharePopup />}
        {enableResultsPopup && <ResultsModal />}
        <StatsModal />
        <ListVotesModal />
        {started && <BottomNav state={[tab, setTab]} />}
      </Context.Provider>
    </ThemeProvider>
  );
}

export default App;

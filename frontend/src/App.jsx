import "./assets/styles/index.scss";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";

import { useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";

import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { theme } from "./theme";

import { ThemeContext } from "./context/ThemeContext";
import { recommendedVotesCount } from "./data/variables";

import About from "./pages/About";
import MesVotes from "./pages/MesVotes";
import Resultats from "./pages/Resultats";
import Votes from "./pages/Votes";
import Welcome from "./pages/Welcome";

import BottomNav from "./components/BottomNav";
import ListVotesModal from "./components/ListVotesModal";
import Navbar from "./components/Navbar";
import ResultsModal from "./components/ResultsModal";
import SharePopup from "./components/SharePopup";
import StatsModal from "./components/StatsModal";

const enableResultsPopup = false;

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
    localStorage.getItem("started") === "y",
  );
  const choose = ({ vote_id, type, noPopup }) => {
    setChoices((prevChoices) => {
      const newChoices = { ...prevChoices, [vote_id]: type };
      localStorage.setItem("votes", JSON.stringify(newChoices));
      if (
        Object.keys(newChoices).length === recommendedVotesCount &&
        !noPopup
      ) {
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
    <CssVarsProvider theme={theme}>
      <ThemeContext.Provider
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
      </ThemeContext.Provider>
    </CssVarsProvider>
  );
}

export default App;

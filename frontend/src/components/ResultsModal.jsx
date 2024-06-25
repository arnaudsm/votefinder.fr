import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Button, Modal } from "@mui/material";
import ConfettiExplosion from "react-confetti-explosion";
import Trophy from "../assets/icons/trophy.svg";

export default function ResultsModal() {
  const context = useContext(ThemeContext);
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
        <div className="ResultsModal__actions">
          <Button
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
}

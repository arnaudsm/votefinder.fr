import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { Button } from "@mui/material";

export default function NoVotesLeft() {
  const context = useContext(ThemeContext);

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
}

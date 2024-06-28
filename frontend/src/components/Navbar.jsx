import { AppBar, Toolbar } from "@mui/material";
import LogoURL from "../assets/icons/logo_url.svg";

export default function Navbar() {
  return (
    <AppBar position="static" color="white" className="Navbar">
      <Toolbar className="Navbar__toolbar" color="white">
        <a href="https://votefinder.fr">
          <LogoURL className="Navbar__logo" />
        </a>
      </Toolbar>
    </AppBar>
  );
}

import { AppBar, Toolbar } from "@mui/material";
import LogoURL from "../assets/icons/logo_url.svg";
import ModeSwitcher from "./ModeSwitcher";

export default function Navbar() {
  return (
    <AppBar position="static" color="white" className="Navbar">
      <Toolbar color="white">
        <a href="https://votefinder.fr">
          <LogoURL className="logo" />
        </a>

        <ModeSwitcher />
      </Toolbar>
    </AppBar>
  );
}

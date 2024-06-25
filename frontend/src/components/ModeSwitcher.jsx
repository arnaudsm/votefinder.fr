import { useColorScheme } from "@mui/material/styles";
import { Switch } from "@mui/material";

export default function ModeSwitcher() {
  const { mode, setMode } = useColorScheme();

  return (
    <Switch
      variant="outlined"
      className="theme-switcher"
      defaultChecked={mode === "dark"}
      onClick={() => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
      }}
    ></Switch>
  );
}

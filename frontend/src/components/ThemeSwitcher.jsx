import { useColorScheme } from "@mui/material/styles";
import { Switch } from "@mui/material";

export default function ThemeSwitcher() {
  const { mode, setMode } = useColorScheme();

  return (
    <Switch
      variant="outlined"
      className="ThemeSwitcher"
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

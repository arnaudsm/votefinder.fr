import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import {
  EmojiEvents,
  HowToVote,
  Info,
  MarkAsUnread,
} from "@mui/icons-material";

export default function BottomNav({ state: [tab, setTab] }) {
  return (
    <BottomNavigation
      className="BottomNav"
      showLabels
      value={tab}
      onChange={(event, newValue) => setTab(newValue)}
    >
      {[
        { key: "votes", label: "Je vote !", icon: <HowToVote /> },
        { key: "resultats", label: "Mes résultats", icon: <EmojiEvents /> },
        { key: "mes-votes", label: "Mes votes", icon: <MarkAsUnread /> },
        { key: "a-propos", label: "À Propos", icon: <Info /> },
      ].map(({ label, icon, key }) => (
        <BottomNavigationAction
          className="BottomNav__action"
          label={label}
          icon={icon}
          key={key}
        />
      ))}
    </BottomNavigation>
  );
}

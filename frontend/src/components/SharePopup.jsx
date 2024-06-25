import { useContext, useMemo } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import { getRanks } from "../utils/votes.jsx";
import data from "../data/data.json";
import LogoURL from "../assets/icons/logo_url.svg";

export default function SharePopup() {
  const context = useContext(ThemeContext);
  const results = useMemo(() => getRanks(context.choices), [context.choices]);
  return (
    <div className="SharePopup">
      <h1>{"Les partis qui votent comme moi à l'Assemblée Nationale 🏛️🇫🇷"}</h1>
      <div className="SharePopup__list">
        <div className="SharePopup__explanation">
          Pourcentage de votes d’accord
        </div>
        {results.lists.slice(0, 4).map(([id, approval]) => (
          <a
            className="SharePopup__result Result Result--simple"
            href={`https://www.assemblee-nationale.fr/dyn/org/${id}`}
            key={id}
            target="_blank"
          >
            <img src={`/lists/${id}.svg`} alt={data.lists[id].label} />
            <div className="Result__progress">
              <div
                className="Result__bar"
                style={{ width: `${Math.floor(approval * 100)}%` }}
              ></div>
              <div className="Result__name">
                <h4>{data.lists[id].label}</h4>
                <h5>{data.lists[id].leader}</h5>
              </div>
              <div className="Result__score">{`${Math.floor(approval * 100)}%`}</div>
            </div>
          </a>
        ))}
      </div>
      <LogoURL className="SharePopup__logo" />
    </div>
  );
}

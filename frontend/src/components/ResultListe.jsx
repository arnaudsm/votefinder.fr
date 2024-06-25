import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";

export default function ResultListe({ id, approval }) {
  const context = useContext(ThemeContext);

  return (
    <a
      className="ResultListe"
      key={id}
      onClick={() => {
        context.setListVotesPopup(id);
        document.querySelector(".ListVotesModal .content").scrollTo(0, 0);
      }}
    >
      <div className="ResultListe__top">
        <img src={`/lists/${id}.svg`} alt={data.lists[id].label} />
        <div className="ResultListe__progress progress">
          <div
            className="progress__bar"
            style={{ width: `${Math.floor(approval * 100)}%` }}
          ></div>
          <div className="progress__name">
            <h4>{data.lists[id].label}</h4>
            <h5>{data.lists[id].leader}</h5>
          </div>
          <div className="progress__score">
            {data.lists[id].etranger ? "* " : ""}
            {data.lists[id].no_data
              ? "Non Sortant"
              : `${Math.floor(approval * 100)}%`}
          </div>
        </div>
      </div>
    </a>
  );
}

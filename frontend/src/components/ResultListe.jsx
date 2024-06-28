import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext.jsx";
import data from "../data/data.json";

export default function ResultListe({ id, approval }) {
  const context = useContext(ThemeContext);

  return (
    <a
      className="ResultListe Result Result--simple"
      key={id}
      onClick={() => {
        context.setListVotesPopup(id);
        document.querySelector(".ListVotesModal .content").scrollTo(0, 0);
      }}
    >
      <div className="Result__img-container">
        <img
          className="Result__img"
          src={`${import.meta.env.BASE_URL}lists/${id}.svg`}
          alt={data.lists[id].label}
        />
      </div>
      <div className="Result__progress">
        <div
          className="Result__bar"
          style={{ width: `${Math.floor(approval * 100)}%` }}
        ></div>
        <div className="Result__name">
          <h4>{data.lists[id].label}</h4>
          <h5>{data.lists[id].leader}</h5>
        </div>
        <div className="Result__score">
          {data.lists[id].etranger ? "* " : ""}
          {data.lists[id].no_data
            ? "Non Sortant"
            : `${Math.floor(approval * 100)}%`}
        </div>
      </div>
    </a>
  );
}

import data from "../data/data.json";
import { getListsVotes } from "../utils/votes.jsx";

export default function ListVote({ vote_id, list_id }) {
  const vote = data.votes[vote_id];
  const results = getListsVotes(vote?.votes)[list_id];

  return (
    <>
      <div className="result">
        <div className="progress">
          <div
            className="bar pour"
            style={{
              width: `${Math.floor(results["+%"] * 100)}%`,
            }}
          ></div>
          <div
            className="bar contre"
            style={{
              width: `${Math.floor(results["-%"] * 100)}%`,
              marginLeft: `${Math.floor(results["+%"] * 100)}%`,
            }}
          ></div>
          <div className="name">
            <h4>{data.lists[list_id].label}</h4>
          </div>
          <div className="score">
            {`${Math.floor(results["+"])} pour`}
            <br />
            {`${Math.floor(results["-"])} contre`}
            <br />
            {`${Math.floor(results["0"])} abs`}
          </div>
        </div>
      </div>
    </>
  );
}

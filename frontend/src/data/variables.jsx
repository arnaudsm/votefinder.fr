import data from "../data/data.json";

export const minVotesCount = 5;
export const recommendedVotesCount = Object.values(data.votes).filter(
  (x) => x.pinned,
).length;
export const projectURL = "https://github.com/arnaudsm/votefinder.fr";

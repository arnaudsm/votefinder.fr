import data from "./data/data.json";

export const getRanks = (choices) => {
  let deputes = Object.fromEntries(
    Object.keys(data.deputes).map((group) => [group, { "+": 0, "-": 0 }]),
  );
  let lists = Object.fromEntries(
    Object.keys(data.lists).map((group) => [group, { "+": 0, "-": 0 }]),
  );

  const apply = ({ depute_id, choice, total }) => {
    if (!(depute_id in deputes)) return;
    const org_id = data.deputes[depute_id].o[0];
    if (!org_id) return;
    lists[data.org_to_list[org_id]][choice ? "+" : "-"] += 1 / total;
    deputes[depute_id][choice ? "+" : "-"] += 1;
  };

  for (const [vote_id, choice] of Object.entries(choices)) {
    const votes = data.votes?.[vote_id]?.votes;
    const total =
      votes?.["0"].length + votes?.["-"].length + votes?.["+"].length;
    if (choice == "+") {
      for (const depute_id of votes?.["0"] || [])
        apply({ depute_id, choice: false, total });
      for (const depute_id of votes?.["-"] || [])
        apply({ depute_id, choice: false, total });
      for (const depute_id of votes?.["+"] || [])
        apply({ depute_id, choice: true, total });
    } else if (choice == "-") {
      for (const depute_id of votes?.["-"] || [])
        apply({ depute_id, choice: true, total });
      for (const depute_id of votes?.["+"] || [])
        apply({ depute_id, choice: false, total });
    }
  }
  const rank = (x) => {
    let output = [];
    for (const key of Object.keys(x)) {
      output.push([key, x[key]["+"] / (x[key]["-"] + x[key]["+"]) || 0]);
    }
    return output.sort((a, b) => b[1] - a[1]);
  };
  return {
    lists: rank(lists),
    deputes: rank(deputes),
    deputesRaw: deputes,
  };
};

export const getListsVotes = (votes) => {
  let lists = Object.fromEntries(
    Object.keys(data.lists).map((group) => [group, { "+": 0, "-": 0, 0: 0 }]),
  );
  const apply = (depute_id, choice) => {
    if (!(depute_id in data.deputes)) return;
    const org_id = data.deputes[depute_id].o[0];
    if (!org_id) return;
    lists[data.org_to_list[org_id]][choice] += 1;
  };
  for (const choice of ["+", "-", "0"]) {
    for (const depute_id of votes[choice]) {
      apply(depute_id, choice);
    }
  }
  return Object.fromEntries(
    Object.entries(lists).map(([id, results]) => [
      id,
      {
        ...results,
        "+%": results["+"] / (results["+"] + results["-"] + results["0"]),
        "-%": results["-"] / (results["+"] + results["-"] + results["0"]),
      },
    ]),
  );
};

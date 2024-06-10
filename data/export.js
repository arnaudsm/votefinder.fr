import fs from "fs";
import { loadDir, getData, getVotes, listify } from "./data.js";

const { acteurs, organes } = getData();

const lists = {
  PO800484: { label: "Démocrate (MoDem et Indépendants)" },
  PO800490: { label: "La France insoumise - NUPES" },
  PO800502: { label: "Gauche démocrate et républicaine" },
  PO800508: { label: "Les Républicains" },
  PO800514: { label: "Horizons" },
  PO800520: { label: "Rassemblement National" },
  PO800526: { label: "Écologiste - NUPES" },
  PO800532: { label: "Libertés et Territoires" },
  PO800538: { label: "Renaissance" },
  PO830170: { label: "Socialistes" },
};

const org_to_list = {
  PO800484: "PO800484",
  PO800490: "PO800490",
  PO800496: "PO830170",
  PO800502: "PO800502",
  PO800508: "PO800508",
  PO800514: "PO800514",
  PO800520: "PO800520",
  PO800526: "PO800526",
  PO800532: "PO800532",
  PO800538: "PO800538",
  PO830170: "PO830170",
};

const deputes = Object.fromEntries(
  Object.values(acteurs)
    .filter((x) =>
      listify(x?.mandats?.mandat || []).find(
        (x) => x.legislature == "16" && x.typeOrgane == "ASSEMBLEE"
      )
    )
    .map((x) => [
      x.uid["#text"],
      {
        l: `${x.etatCivil.ident.prenom} ${x.etatCivil.ident.nom}`,
        o: listify(x?.mandats?.mandat || [])
          .filter(
            (x) =>
              x.legislature == "16" &&
              x.typeOrgane == "GP" &&
              x.organes.organeRef != "PO793087"
          )
          .map((x) => x.organes.organeRef),
      },
    ])
);

const allVotes = Object.fromEntries(getVotes().map((x) => [x.vote_id, x]));
const votes = Object.fromEntries(
  loadDir("votes")
    .filter((x) => x.vote_id)
    .map((x) => ({
      ...allVotes[x.vote_id],
      ...x,
    }))
    .map((x) => [x.vote_id, x])
);

const dataset = {
  votes,
  lists,
  deputes,
  org_to_list,
};

fs.writeFileSync("../frontend/src/data.json", JSON.stringify(dataset));
console.log("✅ Données exportées");

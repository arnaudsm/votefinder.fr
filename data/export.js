import fs from "fs";
import { getData, listify } from "./data.js";

const data = getData();

const lists = {
  PO830170: { label: "Socialistes" },
  PO800490: { label: "La France insoumise - NUPES" },
  PO800484: { label: "Démocrate - MoDem et Indépendants" },
  PO800526: { label: "Écologiste - NUPES" },
  PO800502: { label: "Gauche démocrate et républicaine" },
  PO800532: { label: "Libertés et Territoires" },
  PO800508: { label: "Les Républicains" },
  PO800514: { label: "Horizons" },
  PO800538: { label: "Renaissance" },
  PO800520: { label: "Rassemblement National" },
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
  Object.values(data.acteurs)
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

const allVotes = Object.fromEntries(
  Object.entries(data.votes)
    .map(([vote_id, data]) => {
      let voteData = { 0: [], "+": [], "-": [] };
      for (const groupe of data.ventilationVotes.organe.groupes.groupe) {
        const decompte = groupe?.vote?.decompteNominatif;
        if (!decompte) return;
        for (const acteur of listify(decompte?.pours?.votant) || [])
          voteData["+"].push(acteur.acteurRef);
        for (const acteur of listify(decompte?.contres?.votant) || [])
          voteData["-"].push(acteur.acteurRef);
        for (const acteur of listify(decompte?.abstentions?.votant) || [])
          voteData["0"].push(acteur.acteurRef);
      }
      voteData["0"] = [...new Set(voteData["0"])];
      voteData["+"] = [...new Set(voteData["+"])];
      voteData["-"] = [...new Set(voteData["-"])];

      return [vote_id, voteData]
    })
);

const votes = Object.fromEntries(
  fs
    .readdirSync("votes")
    .map((file) => {
      const vote_id = file.replace(".json", "");
      const data = JSON.parse(fs.readFileSync(`votes/${vote_id}.json`));
      return {
        ...data,
        vote_id,
        votes: allVotes[vote_id],
      };
    })
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

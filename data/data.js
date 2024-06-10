import fs from "fs";
import path from "path";
import pako from "pako";

const load = (file) => JSON.parse(fs.readFileSync(file));

export const loadDir = (dir) =>
  fs
    .readdirSync(dir)
    .map((file) => path.join(dir, file))
    .map((file) => JSON.parse(fs.readFileSync(file)));

// Nécéssite les dumps JSON du site opendata de l'AN
// https://data.assemblee-nationale.fr/
const exportData = () => {
  const data = {
    acteurs: Object.fromEntries(
      loadDir("acteur")
        .map((x) => x.acteur)
        .map((x) => [x.uid["#text"], x])
    ),
    deports: Object.fromEntries(
      loadDir("deport")
        .map((x) => x.deport)
        .map((x) => [x.uid, x])
    ),
    documents: Object.fromEntries(
      loadDir("document")
        .map((x) => x.document)
        .map((x) => [x.uid, x])
    ),
    dossiers: Object.fromEntries(
      loadDir("dossier")
        .map((x) => x.dossierParlementaire)
        .map((x) => [x.uid, x])
    ),
    organes: Object.fromEntries(
      loadDir("organe")
        .map((x) => x.organe)
        .map((x) => [x.uid, x])
    ),
    votes: Object.fromEntries(
      loadDir("votes")
        .map((x) => x.scrutin)
        .map((x) => [x.uid, x])
    ),
  };

  fs.writeFileSync("data.json", JSON.stringify(data));
};

export const getData = () =>
  JSON.parse(pako.inflate(fs.readFileSync("data.json.gz"), { to: "string" }));

export const listify = (x) => (x ? (Array.isArray(x) ? x : [x]) : null);

export const getVotes = () => {
  const { acteurs, deports, documents, dossiers, organes, votes } = getData();
  return Object.values(dossiers)
    .filter((x) => Array.isArray(x?.actesLegislatifs?.acteLegislatif))
    .map((x) => {
      const actes = (x?.actesLegislatifs?.acteLegislatif || [])
        ?.filter((y) => Array.isArray(y?.actesLegislatifs?.acteLegislatif))
        .map((y) => y?.actesLegislatifs?.acteLegislatif)
        .flat()
        ?.filter((y) => Array.isArray(y?.actesLegislatifs?.acteLegislatif))
        .map((y) => y?.actesLegislatifs?.acteLegislatif)
        .flat();

      const dernierActe = actes
        .filter(
          (x) =>
            x?.codeActe?.startsWith("AN") &&
            x?.voteRefs?.voteRef?.startsWith("VTANR5L16")
        )
        .at(-1);
      const vote_id = dernierActe?.voteRefs?.voteRef;
      const vote = votes[vote_id];
      if (!vote) return;
      let voteData = { 0: [], "+": [], "-": [] };
      for (const groupe of vote.ventilationVotes.organe.groupes.groupe) {
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

      const doc_id = (x?.actesLegislatifs?.acteLegislatif || [])
        ?.filter((y) => Array.isArray(y?.actesLegislatifs?.acteLegislatif))
        .map((y) => y?.actesLegislatifs?.acteLegislatif)
        .flat()
        .filter((x) => x.codeActe == "AN1-DEPOT")[0].texteAssocie;

      return {
        vote_id,
        proc_id: x.uid,
        doc_id,
        assemblee_url: x.titreDossier?.titreChemin
          ? `https://www.assemblee-nationale.fr/dyn/16/dossiers/alt/${x.titreDossier?.titreChemin}`
          : null,
        senat_url: x.titreDossier.senatChemin,
        date: vote.dateScrutin,
        type: x?.procedureParlementaire?.libelle,
        votes: voteData,
      };
    })
    .filter((x) => x);
};

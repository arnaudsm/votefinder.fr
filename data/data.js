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

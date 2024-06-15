import fs from "fs";
import { summarize } from "./openai.js";
import { pRateLimit } from "p-ratelimit";
import { parse } from "node-html-parser";
import { getSheet, getVoteId, amendement_urls } from "./sync.js"
import { getData, listify } from "./data.js";
import { readPdfText } from "pdf-text-reader";

const limit = pRateLimit({
  interval: 1000,
  rate: 2,
  concurrency: 1,
});

const getPage = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  return parse(html);
};

function splitOnFirst(str, sep) {
  const index = str.indexOf(sep);
  return index < 0
    ? [str]
    : [str.slice(0, index), str.slice(index + sep.length)];
}

const getText = async (vote) => {
  let document;
  if (vote.amendement_url) {
    const summary_url = vote.amendement_url
    document = await getPage(summary_url)
    const title = document.querySelector(".amendement-detail  ul > li:nth-child(1) > a > span").innerText
    const text = document.querySelector(".amendement-section:last-of-type").innerText
    return { summary_url, text: `${title}\n\n\n${text}` }
  } else {
    document = await getPage(vote.senat_url);
    let summary_url = document
      .querySelector(".page-header .card .nav-link-arrow")
      ?.getAttribute("href");
    let pdf_url = document
      .querySelector(".page-header .btn-primary")
      ?.getAttribute("href");
    if (summary_url) {
      summary_url = "https://www.senat.fr" + summary_url;
      document = await getPage(summary_url);
      const title = document.querySelector(".page-title").innerText;
      const text = document.querySelector(".container .col-md-8").innerText;
      return { summary_url, text: `${title}\n\n\n${text}` }
    } else if (pdf_url) {
      summary_url = "https://www.senat.fr" + pdf_url;
      const text = await readPdfText({ url: summary_url, isEvalSupported: true });
      return { summary_url, text }
    } else {
      const summary_url = `https://www.assemblee-nationale.fr/dyn/docs/${vote.doc_id}.raw`;
      document = await getPage(summary_url);

      let text = document
        .querySelector(`body`)
        ?.innerText?.toLowerCase()
        ?.replaceAll("\n\n\n", "\n\n")
        ?.replaceAll("\t\t", "")
        ?.replaceAll("\t\n", "\n")
        ?.replaceAll("\n  \n", "\n")
        ?.replaceAll("\n\n\n", "\n\n")
        ?.replaceAll("\t\t", "")
        ?.replaceAll("\t\n", "\n");
      if (!text) return {};
      if (text.includes("exposé des motifs"))
        text = splitOnFirst(text, "exposé des motifs")[1];

      if (text.includes("exposé général des motifs"))
        text = splitOnFirst(text, "exposé général des motifs")[1];

      text = text.trim();
      return { text, summary_url }
    }
  }
}

const scrape = async (vote) => {
  const file = `resumes/${vote.vote_id}.json`;
  const { text, summary_url } = await getText(vote)
  const summary = await summarize(text);
  console.log({ summary });
  if (!summary || Object.keys(summary).length == 0) return fs.writeFileSync(file, "");


  fs.writeFileSync(
    file,
    JSON.stringify({
      ...summary,
      ...vote,
      summary_url
    })
  );
};

const { acteurs, deports, documents, dossiers, organes, votes } = getData();

const dossiersTodo = Object.values(dossiers)
  .map((x) => {
    const actes = (listify(x?.actesLegislatifs?.acteLegislatif) || [])
      .map((y) => listify(y?.actesLegislatifs?.acteLegislatif))
      .flat()
      .map((y) => listify(y?.actesLegislatifs?.acteLegislatif))
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

    const total = Number(vote.syntheseVote.nombreVotants)
    const pour = Number(vote.syntheseVote.decompte.pour)
    if (pour / total > .95) return

    const doc_id = (listify(x?.actesLegislatifs?.acteLegislatif) || [])
      .map((y) => listify(y?.actesLegislatifs?.acteLegislatif) || [])
      .flat()
      .filter((x) => x.codeActe == "AN1-DEPOT")?.[0]?.texteAssocie;

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
    };
  })

  .filter((x) => x)

const dossiersCounter = {}

const amendementsTodo = Object.entries(amendement_urls)
  .map(([amendement_url, { dossier_id, amendement_id, vote_id }]) => ({ amendement_url, amendement_id, vote_id: `VTANR5L16V${vote_id}`, dossier_id }))
  .map(x => {
    const dossier = dossiers[x.dossier_id]
    const vote = votes[x.vote_id]
    if (!vote || !dossier) return

    return {
      vote_id: x.vote_id,
      amendement_url: x.amendement_url,
      assemblee_url: dossier.titreDossier?.titreChemin
        ? `https://www.assemblee-nationale.fr/dyn/16/dossiers/alt/${dossier.titreDossier?.titreChemin}`
        : null,
      senat_url: dossier.titreDossier.senatChemin,
      date: vote.dateScrutin,
      type: "Amendement",
    }
  })
  .filter(x => x)
  .filter(x => {
    const vote = votes[x.vote_id]
    if (!vote) return
    const total = Number(vote.syntheseVote.nombreVotants)
    const pour = Number(vote.syntheseVote.decompte.pour)
    return pour / total < .90
  })
  .filter(x => x)
// .filter(x => {
//   if (!dossiersCounter[x.assemblee_url])
//     dossiersCounter[x.assemblee_url] = 0

//   dossiersCounter[x.assemblee_url] += 1
//   return dossiersCounter[x.assemblee_url] < 10
// })


const existingresumes = async () => {
  const sheet = await getSheet()
  const rows = sheet.map(x => ({
    ...x,
    vote_id: getVoteId(x.vote_url)
  }))
  rows
    .filter(x => x.vote_id && x?.summary?.split("\n").length > 1)
    .forEach(x => fs.writeFileSync(`resumes/${x.vote_id}.json`, JSON.stringify(x)))
}

const shuffle = arr => {
  if (arr.length === 1 || arr.length === 0) { return arr };
  const rand = Math.floor(Math.random() * arr.length);
  return [arr[rand], ...shuffle(arr.filter((_, i) => i != rand))];
};

const urls_todo = [
]
const todo = shuffle([
  ...dossiersTodo,
  ...amendementsTodo,
]
  .filter(x => urls_todo.includes(x.amendement_url || x.senat_url))
  .filter(x => !fs.existsSync(`resumes/${x.vote_id}.json`))
)
await Promise.all(todo.map((vote) => limit(() => scrape(vote))));


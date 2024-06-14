import fs from "fs";
import { stringify as csvStringify } from "csv-stringify/sync";
import { getSheet } from "./sync.js"
import { getData } from "./data.js";
import 'array-deluxe'


const main = async () => {
  const { votes } = getData();

  const summarizeVote = (vote_id) => {
    let output = ""
    const vote = votes[vote_id]?.ventilationVotes?.organe?.groupes?.groupe
    if (!vote) return ""
    const isAgainst = (groups) => {
      const groupVotes = vote.filter(x => groups.includes(x.organeRef))
      const total = groupVotes.map(x => Number(x.vote.decompteVoix.contre) + Number(x.vote.decompteVoix.pour) + Number(x.vote.decompteVoix.abstentions) + Number(x.vote.decompteVoix.nonVotants)).sum()
      const contre = groupVotes.map(x => Number(x.vote.decompteVoix.contre) + Number(x.vote.decompteVoix.abstentions)).flat().sum()
      return contre / total > .5
    }
    const groupes = {
      PS: ["PO830170"],
      LFI: ["PO800490"],
      Ecolos: ["PO800526"],
      LR: ["PO800508"],
      Macron: ["PO800538"],
      RN: ["PO800520"]
    }

    const noms_contre = Object.entries(groupes)
      .filter(([nom, groupe]) => isAgainst(groupe))
      .map(([nom]) => nom)
    if (noms_contre.length == 0) return ""
    return `${noms_contre.join(" ")}`
  }

  const existing_vote_urls = new Set((await getSheet()).map(x => x.vote_url))
  const output = fs.readdirSync("resumes")
    .map(x => JSON.parse(fs.readFileSync("resumes/" + x)))
    .map((x) => ({
      contre: summarizeVote(x.vote_id),
      summary: x.summary || [
        x.titre,
        "- " + x.sous_titre_1,
        "- " + x.sous_titre_2,
      ].join("\n"),
      vote_url: x.vote_url || x.amendement_url || `https://www.assemblee-nationale.fr/dyn/16/scrutins/${x.vote_id.slice(10)}`,
      type: x.type,
      summary_url: x.summary_url,
      date: x.date,
      assemblee_url: x.assemblee_url,
      senat_url: x.senat_url,
    }))
    .filter(x => !existing_vote_urls.has(x?.vote_url))
  console.log(output.length);
  const csv = csvStringify(output, {
    header: true, columns: [
      "summary",
      "vote_url",
      "type",
      "contre",
      "summary_url",
      "date",
      "assemblee_url",
      "senat_url",
    ]
  })
  fs.writeFileSync("new.csv", csv)
};

main();

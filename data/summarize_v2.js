import fs from "fs";
import { summarize } from "./openai.js";
import { getVotes } from "./data.js";
import { pRateLimit } from "p-ratelimit";
import { parse } from "node-html-parser";
import { stringify as csvStringify } from "csv-stringify/sync";

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

const scrape = async (vote) => {
  const file = `debug/${vote.vote_id}.csv`;
  const summary_url = `https://www.assemblee-nationale.fr/dyn/docs/${vote.doc_id}.raw`;
  let document = await getPage(summary_url);

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
  if (!text) return;
  if (text.includes("exposé des motifs"))
    text = splitOnFirst(text, "exposé des motifs")[1];

  if (text.includes("exposé général des motifs"))
    text = splitOnFirst(text, "exposé général des motifs")[1];

  text = text.trim();

  const summary = await summarize(text);
  if (Object.keys(summary).length == 0) return fs.writeFileSync(file, "");

  const data = {
    summary: summary?.titre
      ? [
          summary?.titre,
          "- " + summary?.sous_titre_1,
          "- " + summary?.sous_titre_2,
        ].join("\n")
      : "",
    summary_url,
    type: vote.type,
    date: vote.date,
    assemblee_url: vote.assemblee_url,
    senat_url: vote.senat_url,
    vote_id: vote.vote_id,
  };
  const output = csvStringify([data], {
    header: false,
    columns: [
      "summary",
      "type",
      "date",
      "assemblee_url",
      "senat_url",
      "vote_id",
    ],
  });
  fs.writeFileSync(file, output);
};

const ids = [];
const votes = Object.fromEntries(getVotes().map((x) => [x.vote_id, x]));
await Promise.all(
  ids
    .map((id) => votes[id])
    .filter((vote) => !fs.existsSync(`debug/${vote.vote_id}.csv`))
    .map((vote) => limit(() => scrape(vote)))
);

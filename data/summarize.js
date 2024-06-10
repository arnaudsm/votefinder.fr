import fs from "fs";
import { summarize } from "./openai.js";
import { getVotes } from "./data.js";
import { pRateLimit } from "p-ratelimit";
import { parse } from "node-html-parser";
import { readPdfText } from "pdf-text-reader";

const limit = pRateLimit({
  interval: 1000,
  rate: 2,
  concurrency: 2,
});

const getPage = async (url) => {
  const res = await fetch(url);
  const html = await res.text();
  return parse(html);
};

const scrape = async (vote) => {
  const file = `votes/${vote.vote_id}.json`;
  const page = await getPage(vote.senat_url);
  let summary_url = page
    .querySelector(".page-header .card .nav-link-arrow")
    ?.getAttribute("href");
  let pdf_url = page
    .querySelector(".page-header .btn-primary")
    ?.getAttribute("href");

  let title, text;
  if (summary_url) {
    summary_url = "https://www.senat.fr" + summary_url;
    const page2 = await getPage(summary_url);
    title = page2.querySelector(".page-title").innerText;
    text = page2.querySelector(".container .col-md-8").innerText;
  } else if (pdf_url) {
    pdf_url = "https://www.senat.fr" + pdf_url;
    title = "";
    text = await readPdfText({ url: pdf_url, isEvalSupported: true });
  } else {
    return fs.writeFileSync(file, JSON.stringify({}));
  }
  const summary = await summarize(`${title}\n\n\n${text}`);
  if (Object.keys(summary).length == 0)
    return fs.writeFileSync(file, JSON.stringify({}));

  fs.writeFileSync(
    file,
    JSON.stringify({
      ...summary,
      summary_url: summary_url || pdf_url,
      vote_id: vote.vote_id,
      proc_id: vote.proc_id,
    })
  );
};

const main = async () => {
  const votes = getVotes().filter(
    (x) => !fs.existsSync(`votes/${x.vote_id}.json`)
  );

  await Promise.all(votes.map((vote) => limit(() => scrape(vote))));
};

main();

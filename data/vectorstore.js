import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import http from "http";
import https from "https";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { readPdfText } from "pdf-text-reader";
import { amendement_urls } from "./sync.js";

const getFinalPdfUrl = async (seanceUrl) => {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(seanceUrl);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            method: 'HEAD',
        };

        const client = parsedUrl.protocol === 'https:' ? https : http;

        const request = client.request(options, response => {
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                parsedUrl.pathname = response.headers.location
            }
            resolve(`${parsedUrl.toString()}.pdf`)
        });
        request.on('error', error => {
            console.error('Error fetching final URL:', error);
            reject(error);
        });
        request.end();
    });
}

const uniqueIds = new Set(Object.entries(amendement_urls).map(([amendement_url, { seance_id }]) => seance_id))
const allUrls = await Promise.all(Array.from(uniqueIds).map(x => getFinalPdfUrl(`https://www.assemblee-nationale.fr/dyn/crSeanceRedirect/${x}`)));
console.log(allUrls)

const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 4096,
    chunkOverlap: 256,
})

var splitted_texts = [];
var metadatas = [];
for (const pdfUrl of allUrls) {
    const text = await readPdfText({ url: pdfUrl, isEvalSupported: true });
    const output = await splitter.splitText(text);
    splitted_texts.push(...output)
    metadatas.push(...output.map(x => ({ url: pdfUrl })))
}
const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text:latest" })
const vectorStore = await HNSWLib.fromTexts(
    splitted_texts,
    metadatas,
    embeddings
);
const directory = "outputs";
await vectorStore.save(directory);
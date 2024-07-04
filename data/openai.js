import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { HNSWLib } from "@langchain/community/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";
import { backOff } from "exponential-backoff";
import OpenAI from "openai";

const aiConfig = {
  "ollama": {
    openai: new OpenAI({ baseURL: 'http://localhost:11434/v1', }),
    embeddings: new OllamaEmbeddings({ model: "nomic-embed-text:latest" }),
    chatModel: "llama3:latest",
    vsdirectory: "ollama_outputs"
  },
  "openai": {
    openai: new OpenAI(),
    embeddings: new OpenAIEmbeddings({ model: "text-embedding-3-small" }),
    chatModel: "gpt-4o",
    vsdirectory: "openai_outputs"
  }
};
const { openai, embeddings, chatModel, vsdirectory } = aiConfig.openai;
const vectorStore = await HNSWLib.load(vsdirectory, embeddings)

export const summarize = async (content) => {
  if (!content) return
  const completion = await backOff(
    () =>
      openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Résumes en francais le contenu de cette loi (ou amendement) à l'assemblée nationale francaise.
        Sois précis et pas trop général. Utilises des mots faciles à comprendre.
        Pas de phrases consensuelles, parles d'actions concrètes. Sois synthétique, ne mentionne pas le parlement ou le type de texte.

        titre: Objectif de la loi. Moins de 30 mots.
        sous_titre_1: Contexte de la loi. Moins de 60 mots.
        sous_titre_2: Mesure phare, chiffrée si possible. Moins de 60 mots.

        Résumes la loi dans le format JSON suivant:
        {
            "titre": "",
            "sous_titre_1": "",
            "sous_titre_2": ""
        }

        Ecris dans le même style que ces exemples :
        {
            "titre": "Assouplir la réglementation du glyphosate",
            "sous_titre_1": "Autoriser le pesticide jusqu'en 2026 au plus tard",
            "sous_titre_2": "Mais obliger la transparence des pesticides chimiques face aux dangers pour la santé"
        }
        {
            "titre": "Établir un droit constitutionnel à l'avortement",
            "sous_titre_1": "Protéger les droits sexuels et reproductifs en France",
            "sous_titre_2": "Etablir un accès universel à l'avortement légal, sûr et gratuit"
        }
        Les 3 phrases ne doivent pas se répéter mais doivent se compléter
        `,
          },
          {
            role: "user",
            content: content.slice(0, 20000 * 4),
          },
        ],
        model: chatModel,
        response_format: { type: "json_object" },
      }),
    {
      retry: (e) => {
        console.log(e);
        if (e.status == 429) return true;
      },
    }
  );

  const data = JSON.parse(completion.choices[0].message.content);
  return data;
};

export const argue = async (subject) => {
  const completion = await backOff(
    async () => {
      const retrievedDocs = await vectorStore.similaritySearch(subject, 5)
      const context = retrievedDocs.map((doc) => doc.pageContent).join("\n\n")
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Extrais les arguments pour et contre du contexte fourni qui est issu de débats à l'assemblée nationale.
                      Paraphrases les arguments des députés.
                      Sois précis et pas trop général. Utilises des mots faciles à comprendre.
                      Pas de phrases consensuelles, parles de faits concrètes.

                      pour: Arguments pour. Moins de 4 arguments.
                      contre: Arguments contre. Moins de 4 arguments.

                      Résumes la loi dans le format JSON suivant:
                      {
                          "pour": "",
                          "contre": "",
                      }
                      Ecris dans le même style que cet exemple (interdiction du glyphosate) :
                      {
                          "pour": "Ce pesticide est dangereux pour la nature. Il est reconnu comme « probablement cancérigène » par l'OMS. Écotoxique, il contamine les sols, l'air et l'eau, affectant gravement la biodiversité.",
                          "contre": "Pour s'en passer, il serait nécessaire de changer nos pratiques culturales. Cela mettrait nos agriculteurs en difficulté"
                      }
                      `,
          },
          {
            role: "user",
            content: `Sujet: ${subject}

                      contexte:
                      ${context}
                      `,
          },
        ],
        model: chatModel,
        response_format: { type: "json_object" },
      })
      return completion
    },
    {
      retry: (e) => {
        console.log(e);
        if (e.status == 429) return true;
        return false
      },
    }
  );
  const data = JSON.parse(completion.choices[0].message.content);
  return data;
};
import OpenAI from "openai";
import "dotenv/config";
import { backOff } from "exponential-backoff";

const openai = new OpenAI();

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
        model: "gpt-4o",
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


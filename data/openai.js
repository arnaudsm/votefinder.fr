import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI();

export const summarize = async (content) => {
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Résumes en francais le contenu de cette loi du parlement européen. 
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
        
        Si la loi parle d'un sujet non-politique et technique (budget ou comptabilité), écris juste un objet vide en format JSON:
        {}
        
        Ecris dans le même style que ces exemples :
        {
            "titre": "Condamner l'aggression Russe en Ukraine",
            "sous_titre_1": "Apporter de l'aide humanitaire aux civils fuyant le pays",
            "sous_titre_2": "Geler les actifs des oligarques russes proches de Poutine"
        }
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
        Les 4 phrases ne doivent pas se répéter mais doivent se compléter
        `,
      },
      {
        role: "user",
        content,
      },
    ],
    model: "gpt-4o",
    response_format: { type: "json_object" },
  });

  const data = JSON.parse(completion.choices[0].message.content);
  return data;
};

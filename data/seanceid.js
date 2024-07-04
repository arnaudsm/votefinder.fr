import fs from 'fs';
import path from 'path';

const getSeanceId = (dossierId, amendementId) => {
    const folderPath = `amendements/${dossierId}`;
    const subFolders = fs.readdirSync(folderPath, 'utf8');
    let seanceId = null;
    for (let subFolder of subFolders) {
        const subFolderPath = path.join(folderPath, subFolder)
        const stat = fs.statSync(subFolderPath);
        if (stat.isDirectory()) {
            const files = fs.readdirSync(subFolderPath, 'utf8')
            for (let file of files) {
                if (file == `${amendementId}.json`) {
                    const filePath = path.join(subFolderPath, file);
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const content = JSON.parse(fileContent);
                    seanceId = content.amendement.seanceDiscussionRef;
                    return seanceId;
                }
            }
        }
    }
    return seanceId
}
const updateAmendementsUrls = () => {
    const filePath = 'amendement_urls.json';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const content = JSON.parse(fileContent)
    for (let url in content) {
        const seance_id = getSeanceId(content[url].dossier_id, content[url].amendement_id)
        content[url].seance_id = seance_id
    }
    fs.writeFileSync(filePath, JSON.stringify(content, null, 4), 'utf8');
    return content;
};

updateAmendementsUrls();
console.log("✅ Amendements mis à jour");
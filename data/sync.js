import fs from 'fs';

export const getSheet = async () => {
    const filePath = 'sheet.json';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const records = JSON.parse(fileContent);
    return records;
};

export const getVoteId = (url) => {
    const parts = url.split('/');
    const id = parts[parts.length - 1]
    return id;
};

const getAmendementsUrls = () => {
    const filePath = 'amendement_urls.json';
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const content = JSON.parse(fileContent)
    return content;
};

export const amendement_urls = getAmendementsUrls();
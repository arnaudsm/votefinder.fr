# VoteFinder

![Logo](frontend/src/icons/logo.svg)

Une application web de statistiques sur les votes de l'assemblée nationale pour aider à choisir son candidat.

## Contribuer

Les contribution techniques sont les bienvenues, mais aussi les non-techniques.
VoteFinder ne comporte qu'une centaine de lois résumées pour l'instant. N'hésitez pas à rajouter la votre !

Notre ligne éditoriale sur les textes est la suivante

- Préférer les votes de texte entier, le vote final de préférence.
- Eviter les petits amendements rejetés pour des raisons partisanes.
- Eviter les textes purement techniques sans teneur politique.


## Dépendances

- GNU make
- node.js >= 22 (`nvm use 22`)
- yarn (`npm install --global yarn`)

## Fonctionnement

- `make` pour initialiser et lancer un serveur local
- `make build` pour compiler l'application

## Todo
- Lien Débats
- Déployer Domaine
- Rajouter lien eu
- Améliorer Prompt
- Rajouter label "Législatives"
- Communiqué de presse
- Disclaimer update des listes
- Crash rotations successives
- Taux d'absentéisme
- Tests E2E

# Send in the Clowns

Ce TP vise à créer une application JavaScript qui capture le flux vidéo d'une webcam, applique un filtre de nez rouge à la personne filmée, et diffuse la séquence d'images transformées. L'application sera composée d'une page web et d'un serveur Node.js utilisant des websockets pour la transmission d'images.

## Objectif
L'objectif principal est de développer une interface permettant à l'utilisateur de visualiser deux vidéos simultanément : une première présentant le flux brut de la caméra et une deuxième montrant le flux transformé avec un nez rouge.

## Technologies Utilisées
- **getUserMedia** : Utilisé pour capturer la vidéo depuis la webcam.
- **ml5.js** : Utilisé pour la reconnaissance des key-features dans un visage, en particulier pour appliquer le filtre du nez rouge.
- **WebSockets** : Utilisés pour la diffusion en temps réel des images transformées entre la page web et le serveur Node.js.

## Instructions
1. Clonez ce dépôt.
2. Assurez-vous d'avoir Node.js installé.
3. Installez les dépendances via `npm install`.
4. Lancez le serveur avec `node server.js`.
5. Ouvrez votre navigateur et accédez à l'adresse [http://localhost:3000](http://localhost:3000).

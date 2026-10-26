# ClickFast

ClickFast est un jeu de rapidité dans lequel le joueur doit cliquer le plus de fois possible en 10 secondes.

## Technologies utilisées

- HTML
- CSS
- JavaScript
- Jest pour les tests
- Docker avec Nginx
- GitHub Actions pour l'intégration continue

## Lancer le jeu

### Sans Docker

Ouvrir le fichier `index.html` dans un navigateur.

### Avec Docker

Construire l'image :

docker build -t clickfast .

Lancer le conteneur :

docker run -d --name clickfast-app -p 8080:80 clickfast

Ouvrir http://localhost:8080 dans un navigateur.

Pour arrêter le conteneur :

docker stop clickfast-app

## Lancer les tests

Installer les dépendances :

npm install

Lancer les tests :


npm test


## Intégration continue

GitHub Actions exécute automatiquement les tests puis construit l'image Docker lors d'un push ou d'une pull request.

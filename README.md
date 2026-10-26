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

Construire l'image Docker :

```bash
docker build -t clickfast .
```

Lancer le conteneur :

```bash
docker run -d --name clickfast-app -p 8080:80 clickfast
```

Ouvrir http://localhost:8080 dans un navigateur.

Pour arrêter le conteneur :

```bash
docker stop clickfast-app
```

## Lancer les tests

Installer les dépendances :

```bash
npm install
```

Exécuter les tests :

```bash
npm test
```

## Intégration continue

GitHub Actions exécute automatiquement les tests avec Jest puis construit l'image Docker lors d'un push ou d'une pull request.

## Auteur

Yacine Djebbouri
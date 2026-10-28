# ClickFast

![ClickFast CI](https://github.com/Yacine-213/ClickFast/actions/workflows/ci.yml/badge.svg)

ClickFast est un jeu de rapidité dans lequel le joueur doit cliquer le plus de fois possible en 10 secondes. Le projet met en œuvre des pratiques DevOps : tests automatisés, conteneurisation, intégration continue et supervision.

## Technologies utilisées

- HTML, CSS et JavaScript
- Node.js et Express pour l'API
- PostgreSQL pour le stockage des scores
- Jest pour les tests automatisés
- Docker et Docker Compose
- Nginx pour servir le jeu
- GitHub Actions pour la CI/CD
- Prometheus pour les métriques
- Grafana pour la visualisation

## Lancer le jeu

### Sans Docker

Ouvrir `index.html` dans un navigateur.

### Avec Docker

Construire l'image :

```bash
docker build -t clickfast .
```

Lancer le conteneur :

```bash
docker run -d --name clickfast-app -p 8080:80 clickfast
```

Ouvrir http://localhost:8080.

Arrêter le conteneur :

```bash
docker stop clickfast-app
```

## API

L'API Express propose notamment les routes suivantes :

- `GET /health` : vérification de l'état de l'API et de la connexion à la base de données.
- `POST /scores` : enregistrement d'un score.
- `GET /scores` : consultation des scores.
- `GET /metrics` : exposition des métriques Prometheus.

La configuration de la base de données est fournie par des variables d'environnement. Ne jamais publier les mots de passe ou les clés privées dans le dépôt.

## Tests

Installer les dépendances :

```bash
npm ci
```

Exécuter les tests :

```bash
npm test
```

Les tests couvrent le jeu et l'API.

## Intégration continue

GitHub Actions exécute les tests automatisés. Lorsque les tests réussissent sur `main`, le workflow construit l'image Docker et la publie sur Docker Hub.

## Déploiement sur vm-prod

L'image `dyacine92/clickfast:latest` est importée dans le Docker Engine de `vm-prod`, puis démarrée avec :

```bash
docker exec -i vm-prod docker load < clickfast.tar
docker exec vm-prod docker run -d --name clickfast-deployed -p 3000:80 --restart unless-stopped dyacine92/clickfast:latest
```

L'application est accessible sur http://localhost:3000 depuis la machine hôte.

Pour vérifier le conteneur :

```bash
docker exec vm-prod docker ps
```

## Supervision

Prometheus collecte les métriques exposées par l'API sur `/metrics`. Grafana permet de consulter les métriques et les tendances.

## Auteur

Yacine Djebbouri

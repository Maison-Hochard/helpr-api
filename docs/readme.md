---
order: 1
icon: home
---

![](/logo.png)

# Introduction

Bienvenue dans la documentation de notre API ! Notre API est accessible à tous. Un compte utilisateur TMDB est requis pour demander une clé API. Les utilisateurs professionnels sont approuvés sur une base par application.

---

## Pour commencer
Pour démarrer avec cette API NestJS, suivez ces étapes:

1. Clonez le référentiel:
```bash
git clone git@github.com:Maison-Hochard/helpr-api.git
```

2. Installez les dépendances:
```bash
pnpm install
```

3. Démarrez le serveur de développement:
```bash
pnpm run start:dev
```

Maintenant, vous pouvez ouvrir l'application dans votre navigateur à l'adresse http://localhost:3000. Vous pouvez utiliser un outil comme Postman pour envoyer des demandes aux points de terminaison de l'API. Voici la Collection Postman.

---
## Objectifs
L'objectif de ce modèle de NestJS est de fournir une structure de départ pour les développeurs qui souhaitent créer rapidement une API pour leur application web ou mobile. Il comprend déjà les fonctionnalités courantes telles que l'authentification OAuth avec Google, l'authentification JWT, la gestion du mot de passe oublié, et un envoi de courriels fonctionnel avec un modèle de courriel réactif.

[//]: # (---)

[//]: # (## Questions fréquentes)

[//]: # ()
[//]: # (==- Pourquoi aurais-je besoin d'une API ?)

[//]: # (L'API fournit un moyen rapide, cohérent et fiable d'obtenir des données tierces.)

[//]: # (===)

[//]: # (==- Comment puis-je demander une clé API ?)

[//]: # (Vous pouvez demander une clé API en cliquant sur le lien "API" dans la barre latérale gauche de la page des paramètres de votre compte. Vous devez avoir un nom commercial légitime, une adresse, un numéro de téléphone et une description pour demander une clé API.)

[//]: # (===)

[//]: # (==- Qu'en est-il du SSL ?)

[//]: # (Il est actuellement disponible à l'échelle de l'API. Cela inclut à la fois les points de terminaison de l'API et les actifs servis via notre CDN. Nous vous recommandons fortement d'utiliser SSL.)

[//]: # (===)

[//]: # (==- L'API change-t-elle jamais ? Comment pouvez-vous en savoir plus sur les nouvelles fonctionnalités ?)

[//]: # (Oui, ça peut de temps en temps. Nous faisons de notre mieux pour publier ces mises à jour pertinentes dans la documentation officielle.)

[//]: # (===)

[//]: # (==- Puis-je apporter des modifications à l'API ?)

[//]: # (Non tu ne peux pas. Notre API est une source fermée.)

[//]: # (===)

---

## Architecture

+++ Auth/Create User
**URL:** `http://localhost:3000/auth/register`

**Method:** `POST`

**Body (JSON):**

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "johndoe@gmail.com",
  "username": "johnDoe",
  "password": "password"
}
```
+++ Auth/Login
**URL:** `http://localhost:3000/auth/login`

**Method:** `POST`

**Body (JSON):**

```json
{
  "login": "johnDoe",
  "password": "password"
}
```
+++ Auth/Refresh Token
**URL:** `http://localhost:3000/auth/refresh`

**Method:** `POST`
+++


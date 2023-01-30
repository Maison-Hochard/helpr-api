---
order: 1
icon: home
---

# Introduction

Bienvenue dans la documentation de notre API NestJS! Cette API de serveur Node.js est construite avec NestJS et peut être utilisée pour alimenter une application web ou mobile. Tout est connecté et prêt à l'emploi grâce à notre modèle VueJS, que vous pouvez consulter ici. Cette documentation vous guide à travers les différentes fonctionnalités et options offertes par notre API, pour vous permettre de tirer le meilleur parti de votre développement. [VueJS Template](https://github.com/HugoRCD/vuejs-boilerplate)

---
## Objectifs
L'objectif de ce modèle de NestJS est de fournir une structure de départ pour les développeurs qui souhaitent créer rapidement une API pour leur application web ou mobile. Il comprend déjà les fonctionnalités courantes telles que l'authentification OAuth avec Google, l'authentification JWT, la gestion du mot de passe oublié, et un envoi de courriels fonctionnel avec un modèle de courriel réactif.

---
## Architecture

### Auth/Create User

**URL:** `http://localhost:3000/auth/register`

**Method:** `POST`

**Body (JSON):**

```json
{
  "firstname": "Hugo",
  "lastname": "Richard",
  "email": "hrichard206@gmail.com",
  "username": "HugoRCD",
  "password": "08Janvier"
}
```


### Auth/Login

**URL:** `http://localhost:3000/auth/login`

**Method:** `POST`

**Body (JSON):**

```json
{
  "login": "HugoRCD",
  "password": "08.Janvier"
}
```


### Auth/Refresh Token

**URL:** `http://localhost:3000/auth/refresh`

**Method:** `POST`

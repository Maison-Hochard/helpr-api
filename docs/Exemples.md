---
order: -4
icon: file-code
---

# Exemples d'utilisation

==- Création d'un nouvel utilisateur

Envoi d'une requête POST à l'URL `http://localhost:3000/auth/register` avec le corps de la requête suivant (en JSON):

```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "johndoe@gmail.com",
  "username": "johnDoe",
  "password": "password"
}
```
===
==- Exemple de réponse (succès):

```json
{
  "message": "L'utilisateur a été créé avec succès!",
  "user": {
    "id": 1,
    "firstname": "John",
    "lastname": "Doe",
    "email": "johndoe@gmail.com",
    "username": "johnDoe"
  }
}
```
===
==- Exemple de réponse (erreur):

```json
{
"message": "L'email existe déjà!",
"error": {
"code": 400,
"message": "Bad Request"
}
}
```
===

==- Connexion d'un utilisateur

Envoi d'une requête POST à l'URL `http://localhost:3000/auth/login` avec le corps de la requête suivant (en JSON):

```json
{
  "login": "johnDoe",
  "password": "password"
}
```
===

---
order: 0
icon: apps
---

# Endpoints

---

## Méthodes HTTP supportées

+++ GET
Permet de récupérer des informations à partir de l'API.
+++ POST
Permet d'envoyer des informations à l'API pour créer un nouvel enregistrement.
+++ PUT
Permet de mettre à jour des informations existantes à partir de l'API.
+++ DELETE
Permet de supprimer des informations à partir de l'API.
+++

---

## Paramètres d'entrée

#### Endpoint : Auth/Create User
- **firstname** : Le prénom de l'utilisateur
- **lastname** : Le nom de famille de l'utilisateur
- **email** : L'adresse email de l'utilisateur
- **username** : Le nom d'utilisateur de l'utilisateur
- **password** : Le mot de passe de l'utilisateur

#### Endpoint : Auth/Login
- **login** : Le nom d'utilisateur ou l'adresse email de l'utilisateur
- **password** : Le mot de passe de l'utilisateur

#### Endpoint : Auth/Refresh Token
- Aucun paramètre d'entrée requis.

---

## Exemples de réponse

+++ [!badge variant='success' text='200']
Si les informations de connexion sont correctes, vous recevrez une réponse de succès avec le code HTTP 200 et le corps de la réponse contiendra un jeton d'authentification JWT:
```HTTP/1.1 200 OK
Content-Type: application/json
```
```json
{
  "token": "Exemple token ..."
}
```
+++ [!badge variant='warning' text='201']
Si la création de l'utilisateur est réussie, vous recevrez une réponse de succès avec le code HTTP 201 et le corps de la réponse contiendra les informations sur l'utilisateur créé:
```HTTP/1.1 201 Created
Content-Type: application/json
```
```json
{
"id": 1,
"firstname": "John",
"lastname": "Doe",
"email": "johndoe@gmail.com",
"username": "johnDoe"
}
```
+++ [!badge variant='danger' text='401']
Si les informations de connexion sont incorrectes, vous recevrez une réponse d'erreur avec le code HTTP 401 et le corps de la réponse contiendra un message d'erreur:
```HTTP/1.1 401 Unauthorized
Content-Type: application/json
```
```json
{
  "message": "Username or password is incorrect"
}
```
+++ [!badge variant='danger' text='409']
Si le nom d'utilisateur ou l'adresse e-mail est déjà pris, vous recevrez une réponse d'erreur avec le code HTTP 409 et le corps de la réponse contiendra un message d'erreur:
```HTTP/1.1 409 Conflict
Content-Type: application/json
```
```json
{
  "message": "Username or email already taken"
}
```
+++
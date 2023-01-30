---
order: -1
icon: key
---

# Authentification

---

## Description des mécanismes de sécurité utilisés
!!!
### Mécanismes de sécurité pour l'API
Pour protéger les données sensibles et les transactions de l'API, plusieurs mécanismes de sécurité sont utilisés.
!!!
==- Gard
Gard est un middleware qui vérifie les requêtes HTTP pour s'assurer qu'elles sont autorisées à accéder à l'API. Il peut être utilisé pour vérifier l'authentification et l'autorisation des utilisateurs pour accéder à certaines parties de l'API.
===
==- Stratégie
Une stratégie définit comment les utilisateurs sont authentifiés pour accéder à l'API. Il peut y avoir plusieurs stratégies d'authentification, telles que l'authentification par nom d'utilisateur et mot de passe, ou l'authentification à l'aide de jetons d'authentification.
===
==- JWT (JSON Web Token)
JWT est un format standard pour les jetons d'authentification. Il peut être utilisé pour transmettre des informations d'identification d'un client à un serveur, telles que le nom d'utilisateur et les informations de profil. Les jetons JWT sont signés numériquement pour garantir leur intégrité et leur confidentialité.
===
==- Passport
Passport est une bibliothèque de stratégies d'authentification pour Node.js. Il peut être utilisé pour implémenter diverses stratégies d'authentification, telles que l'authentification par nom d'utilisateur et mot de passe, ou l'authentification à l'aide de jetons JWT. Passport facilite l'implémentation de mécanismes de sécurité pour l'API en fournissant des modules pré-définis pour différentes stratégies d'authentification.
===
---

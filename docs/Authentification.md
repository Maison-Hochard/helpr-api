---
order: -1
icon: key
---

# Authentification

Cette API utilise 3 guards pour gérer les autorisations d'accès aux différents endpoints:

==- JWT Guard
Ce guard permet de vérifier que la requête comporte un token JWT valide. Ce token est envoyé dans le header de la requête sous la forme Authorization: Bearer <token>. Si le token est valide, les informations décodées seront disponibles dans le contexte de la requête (req.user).
===
==- Role Guard
Ce guard permet de vérifier que l'utilisateur connecté a les droits nécessaires pour accéder à un endpoint donné. Les rôles autorisés sont spécifiés dans la définition de la route. Si l'utilisateur n'a pas les droits nécessaires, une erreur 401 sera retournée.
===
==- Local Guard
Ce guard n'est utilisé que pour le endpoint de connexion (/auth/login). Il permet de vérifier que les informations d'identification envoyées (nom d'utilisateur et mot de passe) sont correctes. Si les informations sont correctes, un token JWT sera retourné.
=== 
---

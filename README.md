# Groupomania 
C'est un réseau social interne pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues.

## Exigences émises par le comité
* la présentation des fonctionnalités doit êre simple.
* la création d’un compte doit être simple et possible depuis un téléphone mobile.
* le profil contient très peu d’informations pour que sa complétion soit rapide.
* la suppression du compte est possible.
* l’accès à un forum où les salariés publient des contenus multimédias est présent.
* l’accès à un forum où les salariés publient des textes doit est présent.
* les utilisateurs pouvent facilement repérer les dernières participations des employés.
* le ou la chargé-e de communication Groupomania peut modérer les interactions entre salariés.

## Prérequis
* Vous devrez avoir Vue/CLI, Node et MySQL installés localement sur votre machine.

## Procédure
1. Cloner le projet.
2. Exécutez pour le BACK-END -> npm install puis npm run start. 
3. Exécutez pour le FRONT-END -> npm install puis npm run serve. 
4. Le front-end est visible sur http://localhost:8080.
5. Le back-end est visible sur le port 3000.

    Utilisateurs de la BD
    * admin: admin@email.fr pass: abcABC123*
    * user: invite@email.fr pass: vpnVPN456*
    * user: fred@hotmail.fr pass: azeAZE123+

## Pour se connecter à la BD Mysql
  * HOST: "localhost"
  * USER: "root"
  * PASSWORD: ""
  * DB: "groupomania"
  * dialect: "mysql"

  * (optionnel) importer la DB -> groupomania.sql. 

## Technologies
* Une base de données relationnelles qui se manipule avec le langage MySQL pour le stockage de données.
* Utiliser un framework Front-End au choix, le projet doit être codé en Javascript.
 
## Technologies utilisés
* HTML
* Scss
* NodeJS 14.17.6
* Express 
* @vue/cli@4.5.14
* MySQL 8.0.21
* Javascript
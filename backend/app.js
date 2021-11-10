// Plugins externes
// Importation d EXPRESS, framework de NODE.JS
const express = require('express');

const rateLimit = require("express-rate-limit");

// Declaration des routes
// Importation de la route dédiée aux utilisateurs
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');

// Donne accès au chemin de notre système de fichier "images"
const path = require('path');

// Application EXPRESS
const app = express();

const db = require("./models");

const accountLimiter = rateLimit({
  // maximum 20 requêtes toutes les 5 minutes
  windowMs: 5 * 60 * 1000,
  max: 20,
  message:
    "Trop de tentatives de connexion à partir de cette adresse IP, veuillez réessayer après cinq minutes"
});

// Middleware HEADER contourne les erreurs de securité CORS
app.use((req, res, next) => {
    // Permet d'accéder à notre API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Ajoute les headers mentionnés aux requêtes envoyées vers notre API 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // Permet les méthodes autorisées pour les requêtes HTTP
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// limiter le nombre de demandes d'identification
app.use('/api/auth', accountLimiter)

// créer des tables de base de données si elles n'existent pas
db.sequelize.sync();

app.use(express.json());

// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images')));

// creation des routes
// Va servir les routes dédiées pour l'authentification des utilisateurs
app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);

// Exporte pour declaration d'EXPRESS dans server.js
module.exports = app;
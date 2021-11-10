// Création du routeur Express
const express = require('express');

// Appel du routeur Express
const router = express.Router();

// Importation du middleware AUTH pour sécuriser les routes
const auth = require('../middleware/auth');

//importation du controlleur
const commentCtrl = require('../controllers/comment');

// importation d'ewpress-validator pour la validation des donnees entrantes
const { body, validationResult } = require('express-validator');

//validation schema exress-validator
const schemaValidator = [
    body('comment', 'Comment length not valid')
        .not()
        .isEmpty()
        .isString()
        .isLength({ max:255 })
];

// vérifie si la validation a retenu des erreurs
const checkError =  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    }
    next();
};

// Creation des routes de l'API et de leurs middlewares et controllers
router.post('/:id', auth, schemaValidator, checkError, commentCtrl.addComment);
router.put('/:id', auth, schemaValidator, checkError, commentCtrl.modifyComment);
router.delete('/:id', auth, commentCtrl.deleteComment);

// Exportation du routeur vers app.js
module.exports = router;
// Création du routeur Express
const express = require('express');

// Appel du routeur Express
const router = express.Router();

// Importation du middleware AUTH pour sécuriser les routes
const auth = require('../middleware/auth');

// Importation du middleware MULTER pour la gestion des images
const multer = require('../middleware/multer-config');

// importation du controlleur
const postCtrl = require('../controllers/post');

// importation d'ewpress-validator pour la validation des donnees entrantes
const { body, validationResult } = require('express-validator');


//validation schema exress-validator
const schemaValidator = [
    body('title', 'title not valid')
        .not()
        .isEmpty()
        .isString()
        .isLength({ max: 64}),
    body('desc', 'description not valid')
        .not()
        .isEmpty()
        .isString()
        .isLength({ max:255 })
]

// vérifie si la validation a retenu des erreurs
const checkError =  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    }
    next();
}

//coché si une image doit être envoyée (est nécessaire pour un nouveau message)
const checkIfFile = (req, res, next) => {
    console.log(req.file)
    if (!req.file) {
        return res.status(400).json({error: "image not found !"});
    }
    next();
}

// Creation des routes de l'API et de leurs middlewares et controllers
// permetd'afficher tous les posts
router.get('/', auth, postCtrl.getPosts);
// permet de creer un post ainsi que l'image URL
router.post('/', auth, multer, checkIfFile, schemaValidator, checkError, postCtrl.createPost);
// permet de modifier le post ainsi que l'image
router.put('/:id', auth, multer, schemaValidator, checkError, postCtrl.modifyPost);
// permet de supprimer le post
router.delete('/:id', auth, postCtrl.deletePost);

// Exportation du ROUTER vers app.js
module.exports = router;
// Création du routeur avec Express
const express = require('express');

// On crée un routeur avec la méthode d'EXPRESS
const router = express.Router();

// valide les entres transmises par le client
const { body, oneOf, validationResult } = require('express-validator');

// Importation du middleware AUTH pour sécuriser les routes
const auth = require('../middleware/auth');

// CONTROLLERS qui associe les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

//validation schema exress-validator
const validSchema = {
  username: body('username', 'Your username is not valid')
    .not()
    .isEmpty()
    .matches(/^([a-zA-Z.,'\-àáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ]{3,20})$/),
  email: body('email', 'Your email is not valid')
    .not()
    .isEmpty()
    .isEmail()
    .normalizeEmail(),
  password: body('password', 'Your password is not valid')
    .not()
    .isEmpty()
    .matches(/(^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64}$)/),
};

// Vérifie si la validation a retenu des erreurs
const checkError =
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    next();
  }

// pour vérifier si l'email ou le nom d'utilisateur est correct pour continuer
// en vérifiant le résultat obtenu du validateur
const checkIfOneOfIsValid =
  function (req, res, next) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      let numberOfInvalid = 0
      for (let i = 0; i < result.array().length; i++) {
        if (result.array()[i].param === 'username') {
          numberOfInvalid |= 1; req.body.username = null
        }
        if (result.array()[i].param === 'email') {
          numberOfInvalid |= 2; req.body.email = null
        }
      }
      if (numberOfInvalid == 3) {
        return res.status(422).jsonp(result.array());
      }
    }
    next();
  }

// Routes POST pour les informations fournies par le frontend  
router.post('/register', [validSchema.username, validSchema.email, validSchema.password], checkError, userCtrl.signup);
router.post('/login', [validSchema.email, validSchema.password], checkError, userCtrl.login);
router.put('/', auth, [validSchema.username, validSchema.email], checkIfOneOfIsValid, userCtrl.edit);
router.delete('/', auth, userCtrl.delete);

// Exportation du routeur vers app.js
module.exports = router;
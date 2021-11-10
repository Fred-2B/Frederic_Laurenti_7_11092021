// On utilise BCRYPT pour hasher le mot de passe des utilisateurs
const bcrypt = require('bcrypt');

// On utilise jsonwebtoken pour attribuer un token au moment de la connexion
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = require("../models");
const User = db.user;
const Post = db.post;
const Comment = db.comment;
const Op = db.Sequelize.Op;

// Création de nouveaux utilisateurs dans la BD (Post signup)
exports.signup = (req, res, next) => {
  User.findOne({
    attributes: ['email'],
    where: { email: req.body.email }
  })

  // Hash du mot de passe avec bcrypt et 10 tours pour creer mot de passe securise
  // Création du nouvel utilisateur avec mot de passe crypté (HASH)
    .then(user => {
      if (!user) {
        bcrypt.hash(req.body.password, 10)
          .then(hash => {
            const newUser = {
              password: hash,
              username: req.body.username,
              email: req.body.email,
              isAdmin: false,
            };
            User.create(newUser)
              .then(() => {
                res.status(201).json({ message: 'User created !' });
              })
          })
          .catch(error => res.status(500).json({ error }));
      } else {
        res.status(409).json({ error: 'Email already used!' })
      }
    })
};

// Création de la connexion d'utilisateur enregistré (Post login)
exports.login = (req, res, next) => {
  // Recherche d'un utilisateur dans la BD
  User.findOne({
    where: { email: req.body.email }
  })
    .then(user => {
      // Si on ne trouve pas l'utilisateur on renvoi une erreur
      if (!user) {
        return res.status(401).json({ error: 'User not found!' });
      }
      // On compare le mot de passe de la requete avec le HASH enregistrer dans le user grace a BCRYPT
      bcrypt.compare(req.body.password, user.dataValues.password)
        .then(valid => {
          if (!valid) {
            // Si la comparaison n'est pas bonne cela envoie une erreur
            return res.status(401).json({ error: 'Incorrect password !' });
          }
          // Création d'un token pour sécuriser le compte de l'utilisateur
          res.status(200).json({
            username: user.dataValues.username,
            id: user.dataValues.id,
            isAdmin: user.dataValues.isAdmin,
            token: jwt.sign(
              { userId: user.dataValues.id },
              'MY_SECRET_TOKEN',
              { expiresIn: '1h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.edit = (req, res, next) => {
  User.findOne({
    attributes: ['email','id'],
    //l'utilisateur peut ne pas avoir à envoyer d'e-mail, dans ce cas
    where: { email: req.body.email ? req.body.email : "null" } 
  })
  .then(user => {
    // nous vérifions s'il n'y a pas d'utilisateur trouvé ou si la même adresse e-mail existe déjà (va rediriger vers le "autre")
    if (!user || user.dataValues.id == req.body.userId) {
      User.findOne({
        where: { id: req.body.userId }
      })
        .then(user => {
          if (!user) {
            return res.status(401).json({ error: 'User not found!' });
          }
          bcrypt.compare(req.body.password, user.dataValues.password)
            .then(valid => {
              if (!valid) {
                return res.status(401).json({ error: 'Incorrect password !' });
              }
              
              let newUserData = {
                username: req.body.username ? req.body.username : user.dataValues.username,
                email: req.body.email ? req.body.email : user.dataValues.email
              }
              User.update(newUserData, { where: { id: req.body.userId } })
              Comment.update({ author: newUserData.username }, { where: { authorId: req.body.userId } })
              Post.update({ username: newUserData.username }, { where: { userId: req.body.userId } })
                .then(() => {
                  console.log('User Data edited by ' + user.dataValues.username)
                  res.status(200).json({ message: 'User changed!', username: newUserData.username})
                })
                .catch(error => res.status(401).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
      }  else {
        res.status(409).json({ error: 'Email already used!' })
      }
  })
};

exports.delete = (req, res, next) => {
  User.findOne({
    where: { id: req.body.userId }
  })
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'User not found!' });
      }
      bcrypt.compare(req.body.password, user.dataValues.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Incorrect password !' });
          }
          // supprime l'utilisateur et récupère tous les messages
          User.destroy({ where: { id: req.body.userId } })
          Post.findAll({ where: { userId: req.body.userId } })
            .then((result) => {
              let postsId = [];
              let postsUrlImage = []
              for (let i = 0; i < result.length; i++) {
                postsId.push(result[i].id)
                postsUrlImage.push(result[i].imgURL.split('/images/')[1])
              }
              // récupérer les liens des images liées aux publications et les supprimer
              for (let i = 0; i < postsUrlImage.length; i++) {
                fs.unlink(`images/${postsUrlImage[i]}`, (err) => {
                  if (err) { console.log(`images/${postsUrlImage[i]} not found !`); }
                  else { console.log(`deleted old images/${postsUrlImage[i]}`); }
                })
              }
              // supprime les commentaires des utilisateurs, ainsi que les commentaires liés aux publications qui ont été supprimées
              Comment.destroy({
                where: { [Op.or]: [{ authorId: req.body.userId }, { postId: postsId }] }
              })
              // supprimer les messages des utilisateurs
              Post.destroy({ where: { userId: req.body.userId } })
                .then(() => {
                  res.status(200).json({ message: 'User deleted' })
                })
            })
            .catch(error => res.status(401).json({ error }));
        })
    })
    .catch(error => res.status(500).json({ error }));
};
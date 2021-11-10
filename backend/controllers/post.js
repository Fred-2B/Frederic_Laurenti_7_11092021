// Récupération du module 'file system' de Node permettant de gérer les téléchargements,la modifications d'images et la suppression de tout le fichier
const fs = require('fs');
const db = require("../models");
const Post = db.post;
const User = db.user;
const Comment = db.comment;
const Op = db.Sequelize.Op;

exports.getPosts = (req, res, next) => {
  // On utilise la méthode find pour obtenir la liste complète des post trouvées dans la base
  Post.findAll()
    .then((allPosts) => {
      Comment.findAll()
        .then((allComments) => {
          res.status(200).json({
            result: {
              allPosts: allPosts,
              allComments: allComments
            }
          })
        })
    })
    .catch(error => res.status(400).json({ error }));
};

// Création d'un nouveau post (Post)
exports.createPost = (req, res, next) => {
  User.findOne({
    attributes: ['username'],
    where: { id: req.body.userId }
  })
    .then(user => {
      const newPost = {
        userId: req.body.userId,
        title: req.body.title,
        username: user.dataValues.username,
        desc: req.body.desc,
        // Creation de l'URL de l'image
        imgURL: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      };
      Post.create(newPost)
        .then(() => {
          res.status(201).json({ message: 'Post created !' });
        })
        .catch(error => res.status(500).json({ error })
        );
    })
};

// Modification d'un post
exports.modifyPost = (req, res, next) => {
  User.findOne({
    attributes: ['isAdmin'],
    where: { id: req.body.userId }
  })
    .then(user => {
      Post.findOne({
        attributes: ['userId', 'username', 'imgURL'],
        where: { id: req.params.id }
      })
        .then(post => {
        // Vérifier si auteur ou administrateur
          if (req.body.userId == post.dataValues.userId || user.dataValues.isAdmin == '1') {
            let postObject = {
              title: req.body.title,
              desc: req.body.desc
            }
            const filename = post.dataValues.imgURL.split('/images/')[1];
            if (req.file) {
              // supprime l'ancienne image si une nouvelle a été envoyée
              postObject['imgURL'] = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
              fs.unlink(`images/${filename}`, (err) => {
                if (err) { console.log(`images/${filename} not found !`); }
                else { console.log(`deleted old images/${filename}`); }
              });
            }
            Post.update(
              postObject,
              { where: { id: req.params.id } }
            )
              .then(() => {
                console.log('Item edited by ' + user.dataValues.username)
                res.status(200).json({ message: 'Item changed!' })
              })
              .catch(error => res.status(500).json({ error }));

          } else { throw new Error('unauthorized') }

        })
        .catch(error => res.status(401).json({ error: 'Invalid user ID' }));
    })
};

// Supression d'un post
exports.deletePost = (req, res, next) => {
  User.findOne({
    attributes: ['isAdmin', 'username'],
    where: { id: req.body.userId }
  })
    .then(user => {
      Post.findOne({
        attributes: ['userId', 'imgURL'],
        where: { id: req.params.id }
      })
        .then(post => {
          // Vérifier si auteur ou administrateur
          if (req.body.userId == post.dataValues.userId || user.dataValues.isAdmin == '1') {
            const filename = post.dataValues.imgURL.split('/images/')[1];
            // On efface le fichier (unlink)
            fs.unlink(`images/${filename}`, () => {
              console.log(`deleted images/${filename}`);
              // Supprimer la publication ciblée
              Post.destroy({
                where: { id: req.params.id }
              })
                .then(() => {
                  // Supprimer les commentaires liés à la publication
                  Comment.destroy({
                    where: { postId: req.params.id }
                  })
                    .then(() => {
                      console.log('Item deleted by userId ' + user.dataValues.username)
                      res.status(200).json({ message: 'Item deleted!' })
                    })
                })
                .catch(error => res.status(400).json({ error })
                );
            });
          } else { throw new Error('unauthorized') }
        })
        .catch(error => res.status(401).json({ error }));
    })
};

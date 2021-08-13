const jwt = require('jsonwebtoken');
const models = require('../models');
const fs = require('fs');


exports.createPost = (req, res) => {

    var content = req.body.content;

    if ( content == null) {
        return res.status(400).json({ 'error': 'Un des champs est invalide' });
    }
    models.User.findOne({
        where: { id: req.token.userId }
    })
        .then(userFound => {
            if (!userFound) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            } else {

                models.Post.create({
                    content: content,
                    UserId: req.token.userId,
                    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
                })
                    .then(() => res.status(200).json({ message: 'Post publié !' }))
                    .catch((error) => res.status(400).json({ "error": "Impossible de créer le post" }));
            };
        })
        .catch(error => res.status(500).json({ "error": "Utilisateur invalide" }));
};

// Permet de modifier son profil
exports.modifyPost = (req, res) => {
    const postId = req.params.postId;
    models.Post.findOne({
        where: { id: postId }
    }).then(postFound => {
        models.User.findOne({
            where: { id: req.token.userId }
        }).then(function (userFound) {
            if (!postFound) {
                return res.status(401).json({ error: 'Post non trouvé !' });
            } else {
                if (postFound.UserId != req.token.userId && !userFound.isAdmin) {
                    return res.status(401).json({ message: 'Vous ne pouvez pas modifier ce post' });
                }
                postFound.update({
                    ...req.body,
                    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : postFound.imageUrl
                })
                    .then(() => res.status(200).json({ message: 'Post modifié !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
    }).catch(error => res.status(400).json({ error: "Impossible de modifier ce post" }));
};
// Permet de supprimer un post
exports.deletePost = (req, res) => {
    const postId = req.params.postId;
    models.Post.findOne({
        where: { id: postId }
    }).then(postToDelete => {
        models.User.findOne({
            where: { id: req.token.userId }
        }).then(function (userFound) {
            if (postToDelete != null) {
                if (postToDelete.UserId != req.token.userId && !userFound.isAdmin) {
                    return res.status(401).json({ message: 'Vous ne pouvez pas supprimer ce post' });
                }
                if (postToDelete.imageUrl != null){
                const filename = postToDelete.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                models.Post.destroy({
                    where: { id: postId }
                })
                    .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
                });
                } else {
                    models.Post.destroy({
                        where: { id: postId }
                    })
                        .then(() => res.status(200).json({ message: 'Post supprimée !' }))
                        .catch(error => res.status(400).json({ error }));
                    }
            }
            else {
                return res.status(401).json({ error: "Ce post n'existe pas" })
            };
        })

    }).catch(error => res.status(400).json({ error: "Impossible de supprimer ce post" }));
}
// Permet d'afficher un seul post
exports.getOnePost = (req, res) => {
    const postId = req.params.postId;
    models.Post.findOne({
        where: { id: postId },
        include: [{
            model: models.User,
            attributes: ['username']
        }, {
            model: models.Comment
        }, {
            model: models.React
        }]
    })
        .then(
            (post) => {
                if (post) {
                    res.status(200).json(post);
                } else {
                    return res.status(401).json({ error: "Ce post n'existe pas" })
                }
            }
        )
        .catch(error => res.status(401).json({ error: 'Post introuvable' }));
};
// Permet de récuperer tous les posts
exports.getAllPosts = (req, res) => {
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    const itemsLimit = 50
    if (limit > itemsLimit) {
        limit = itemsLimit;
    }
    models.Post.findAll({
        order: [(order != null) ? order.split(':') : ['id', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: { all:true, nested:true} 
    }).then(
        (post) => {
            res.status(200).json(post);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
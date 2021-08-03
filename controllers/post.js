const jwt = require('jsonwebtoken');
const models = require('../models');
const fs = require('fs');

exports.createPost = (req, res) => {
    var title = req.body.title;
    var content = req.body.content;

    if (title == null || content == null) {
        return res.status(400).json({ 'error': 'Un des champs est invalide' });
    }
    models.User.findOne({
        where: { id: req.token.userId },
    })
        .then(userFound => {
            if (!userFound) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            } else {
                models.Post.create({
                    title: title,
                    content: content,
                    UserId: req.token.userId
                })
                    .then(() => res.status(200).json({ message: 'Post publié !' }))
                    .catch((error) => res.status(400).json({ "error": "Impossible de créer le post" }));
            };
        })
        .catch(error => res.status(500).json({ "error": "Utilisateur invalide" }));
};

// Permet de modifier son profil
exports.modifyPost = (req, res) => {
    models.Post.findOne({
        where: { id: req.params.id }
    })
        .then(postFound => {
            if (!postFound) {
                return res.status(401).json({ error: 'Post non trouvé !' });
            } else {
                postFound.update({
                    ...req.body,
                    imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : postFound.imageUrl
                })
                    .then(() => res.status(200).json({ message: 'Post modifié !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        })
};
// Permet de supprimer un post
exports.deletePost = (req, res) => {
    models.Post.findOne({
        where: { id: req.params.id }
    }).then(post => {
        if (post != null) {
            models.Post.destroy({
                where: { id: req.params.id }
            })
                .then(() => res.status(200).json({ message: 'Post supprimé !' }))
                .catch(error => res.status(400).json({ error }));
        }
        else {
            return res.status(401).json({ error: "Ce post n'existe pas" })
        }
    }).catch(error => res.status(400).json({ error: "Impossible de supprimer ce post" }));
}
// Permet d'afficher un seul post
exports.getOnePost = (req, res) => {
    models.Post.findOne({
        where: { id: req.params.id }
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
        order: [(order != null) ? order.split(':') : ['title', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: ['username']
        }]
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
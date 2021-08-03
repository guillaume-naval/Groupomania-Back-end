const jwt = require('jsonwebtoken');
const models = require('../models');
const fs = require('fs');

exports.createComment = (req, res) => {
    var content = req.body.content;

    if (content == null) {
        return res.status(400).json({ 'error': 'Le champs de texte est vide' });
    }
    models.Post.findOne({
        where: { id: req.params.postId },
    })
        .then(userFound => {
            if (!userFound) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            } else {
                models.Comment.create({
                    content: content,
                    UserId: req.token.userId,
                    PostId: req.params.postId
                })
                    .then(() => res.status(200).json({ message: 'Post publié !' }))
                    .catch((error) => res.status(400).json({ "error": "Impossible de créer le post" }));
            };
        })
        .catch(error => res.status(500).json({ "error": "Utilisateur invalide" }));
};
// Permet de supprimer un post
exports.deleteComment = (req, res) => {
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
exports.getOneComment = (req, res) => {
    models.Comment.findOne({
        where: { id: req.params.commentId, PostId: req.params.postId }
    })
        .then(
            (comment) => {
                if (comment) {
                    res.status(200).json(comment);
                } else {
                    return res.status(401).json({ error: "Ce commentaire n'existe pas" })
                }
            }
        )
        .catch(error => res.status(401).json({ error: 'Post introuvable' }));
};
// Permet de récuperer tous les posts
exports.getAllComments = (req, res) => {
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
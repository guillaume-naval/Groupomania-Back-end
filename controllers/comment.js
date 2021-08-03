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
        .then(post => {
            if (!post) {
                return res.status(401).json({ error: 'Post invalide !' });
            } else {
                models.Comment.create({
                    content: content,
                    UserId: req.token.userId,
                    PostId: req.params.postId
                })
                    .then(() => res.status(200).json({ message: 'Commentaire publié !' }))
                    .catch((error) => res.status(400).json({ "error": "Impossible de créer le commentaire" }));
            };
        })
        .catch(error => res.status(500).json({ "error": "Post introuvable" }));
};
// Permet de supprimer un post
exports.deleteComment = (req, res) => {
    models.Comment.findOne({
        where: { id: req.params.commentId }
    }).then(comment => {
        if (comment != null) {
            models.Comment.destroy({
                where: { id: req.params.commentId }
            })
                .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
                .catch(error => res.status(400).json({ error }));
        }
        else {
            return res.status(401).json({ error: "Ce commentaire n'existe pas" })
        }
    }).catch(error => res.status(400).json({ error: "Impossible de supprimer ce commentaire" }));
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
        .catch(error => res.status(401).json({ error: 'Requête impossible' }));
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
    models.Comment.findAll({
        order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: ['username']
        }]
    }).then(
        (comment) => {
            res.status(200).json(comment);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
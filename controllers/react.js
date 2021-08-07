const jwt = require('jsonwebtoken');
const models = require('../models');

// Permet de créer une réaction
exports.createReact = (req, res) => {
    const reactType = req.body.reactType

    models.Post.findOne({
        where: { id: req.params.postId },
    })
        .then(postFound => {
            if (!postFound) {
                return res.status(401).json({ error: 'Post invalide !' });
            } else {
                models.React.create({
                    reactType: reactType,
                    UserId: req.token.userId,
                    PostId: req.params.postId
                })
                    .then(() => res.status(200).json({ message: 'Réaction publié !' }))
                    .catch((error) => res.status(400).json({ "error": "Impossible de réagir à la publication" }));
            };
        })
        .catch(error => res.status(500).json({ "error": "Post introuvable" }));
};

// Permet de supprimer une réaction
exports.deleteReact = (req, res) => {
    models.React.findOne({
        where: { id: req.params.reactId }
    }).then(ReactToDelete => {
        models.User.findOne({
            where: { id: req.token.userId }
        }).then(function (userFound) {
            if (ReactToDelete != null) {
                if (ReactToDelete.UserId != req.token.userId && !userFound.isAdmin) {
                    return res.status(401).json({ message: 'Vous ne pouvez pas supprimer ce commentaire' });
                }
                models.React.destroy({
                    where: { id: req.params.reactId }
                })
                    .then(() => res.status(200).json({ message: ReactToDelete.reactType + 'supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            else {
                return res.status(401).json({ error: "Cette réaction n'existe pas" })
            }
        })
    }).catch(error => res.status(400).json({ error: "Impossible de supprimer cette réaction" }));
}

// Permet d'afficher les réactions d'un post
exports.getOneReact = (req, res) => {
    models.React.findOne({
        where: { id: req.params.reactId, PostId: req.params.postId }
    })
        .then(
            (react) => {
                if (react) {
                    res.status(200).json(react);
                } else {
                    return res.status(401).json({ error: "Cette réaction n'existe pas" })
                }
            }
        )
        .catch(error => res.status(401).json({ error: 'Requête impossible' }));
};
// Permet de récuperer toutes les reactions
exports.getAllReacts = (req, res) => {
    var fields = req.query.fields;
    var limit = parseInt(req.query.limit);
    var offset = parseInt(req.query.offset);
    var order = req.query.order;
    const itemsLimit = 50
    if (limit > itemsLimit) {
        limit = itemsLimit;
    }
    models.React.findAll({
        order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],
        attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
        limit: (!isNaN(limit)) ? limit : null,
        offset: (!isNaN(offset)) ? offset : null,
        include: [{
            model: models.User,
            attributes: ['username']
        }]
    }).then(
        (react) => {
            res.status(200).json(react);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};
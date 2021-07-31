const jwt = require('jsonwebtoken');
const models = require('../models');
const fs = require('fs');
const { User } = require('../models');

exports.createPost = (req, res) => {
    var title = req.body.title;
    var content = req.body.content;

    if (title == null || content == null) {
        return res.status(400).json({ 'error': 'Un des champs est invalide' });
    }
    if (title.length <= 30 || content.length <= 200) {
        return res.status(400).json({ 'error': 'Un des champs est invalide' });
    }
    models.User.findOne({
        where: { id: req.param.userId }
    })
        .then(userFound => {
            if (!userFound) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            } else {
                models.Post.create({
                    title: title,
                    content: content,
                    userId: userFound
                })
                    .then(() => res.status(200).json({ message: 'Post publié !' }))
                    .catch(error => res.status(400).json({ error }));
            };
        })
        .catch(error => res.status(500).json({ "error": "Utilisateur invalide" }));
};

// Permet de modifier un post
exports.modifyPost = (req, res) => {
    const postObject = req.file ?
        {
            ...JSON.parse(req.body.post),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    models.Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Post modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Permet de supprimer un post
exports.deletePost = (req, res) => {
    models.Post.findOne({ _id: req.params.id })
        .then(post => {
            const filename = post.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                models.Post.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Post supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// Permet de récuperer toutes les posts
exports.getAllPosts = (req, res) => {
    models.Post.find().then(
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
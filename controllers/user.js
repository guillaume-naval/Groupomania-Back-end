const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const models = require('../models');

exports.signup = (req, res, next) => {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var bio = req.body.bio;

    if (email == null || username == null || password == null) {
        return res.status(400).json({ 'error': 'un des champs est invalide' });
    }

    models.User.findOne({
        attributes: ['email'],
        where: { email: email }
    })
        .then(function (userFound) {
            if (!userFound) {
                bcrypt.hash(req.body.password, 10, function (err, bcryptedPassword) {
                    var newUser = models.User.create({
                        email: email,
                        username: username,
                        password: bcryptedPassword,
                        bio: bio,
                        isAdmin: false
                    })
                        .then(function (newUser) {
                            return res.status(201).json({ 'userId': newUser.id })
                        })
                        .catch((err) => res.status(500).json({ "error": "vérification impossible" }));
                })
            } else {
                return res.status(409).json({ 'error': "l'utilisateur existe déjà" });
            }
        })
};

exports.login = (req, res, next) => {
    models.User.findOne({
        attributes: ['email'],
        where: { email: req.body.email }
    })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: userId,
                        token: jwt.sign(
                            { userId: userId },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};
// Permet d'afficher un profil
exports.userProfile = (req, res, next) => {
    models.User.findOne({
        where: { id: userId }
    })
        .then(
            (User) => {
                res.status(200).json(user);
            }
        ).catch(
            (error) => {
                res.status(404).json({
                    error: error
                });
            }
        );
};

// Permet de supprimer le compte
exports.deleteProfile = (req, res, next) => {
    models.User.findOne({ _id: req.params.id })
        .then(user => {
            if (user != null) {
                models.Post.destroy({
                    where: { userId: user.id }
                })
                models.User.destroy({
                    where: { id: user.id }
                })
                    .then(() => res.status(200).json({ message: 'Compte supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            else {
                res.status(401).json({ error: "Cet user n'existe pas" })
            }
        })
}
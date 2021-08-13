const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRegex = /^(?=.*\d).{4,15}$/;

exports.signup = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    var bio = req.body.bio;

    if (email == null || username == null || password == null) {
        return res.status(400).json({ 'error': 'Un des champs est invalide' });
    }
    if (username.length >= 13 || username.length <= 4) {
        return res.status(400).json({ 'error': 'Pseudo invalide (doit comporter 4 à 12 caractères)' });
    }
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 'error': "L'email n'est pas valide" });
    }
    if (!passRegex.test(password)) {
        return res.status(400).json({ 'error': "Le mot de passe n'est pas valide (doit comporter 4 à 15 caractères et inclure au moins 1 chiffre)" });
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

exports.login = (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).json({ 'error': 'un des champs est invalide' });
    } else {
        models.User.findOne({
            where: { email: email }
        })
            .then(userFound => {
                if (!userFound) {
                    return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                } else {
                    bcrypt.compare(req.body.password, userFound.password)
                        .then(valid => {
                            if (!valid) {
                                return res.status(401).json({ error: 'Mot de passe incorrect !' });
                            }

                            res.status(200).json({
                                userId: userFound.id,
                                username :userFound.username,
                                isAdmin :userFound.isAdmin,
                                token: jwt.sign(
                                    { userId: userFound.id },
                                    'RANDOM_TOKEN_SECRET',
                                    { expiresIn: '24h' }
                                )
                            });
                        })
                        .catch(error => res.status(500).json({ "error": "Login impossible" }));
                }
            })
            .catch(error => res.status(500).json({ "error": "Impossible de vérifier l'utilisateur" }));
    }
};
// Permet d'afficher un profil
exports.userProfile = (req, res) => {
    models.User.findOne({
        attributes: ['id', 'email', 'username', 'bio', 'createdAt','isAdmin'],
        where: { id: req.params.id }
    })
        .then(
            (user) => {
                res.status(200).json(user);
            }
        )
        .catch(error => res.status(401).json({ error: 'Utilisateur introuvable' }));
};

// Permet de modifier son profil
exports.modifyProfile = (req, res) => {
    var bio = req.body.bio;
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

    if (username.length >= 13 || username.length <= 4) {
        return res.status(400).json({ 'error': 'Pseudo invalide (doit comporter 4 à 12 caractères)' });
    }
    if (!emailRegex.test(email) && email != null) {
        return res.status(400).json({ 'error': "L'email n'est pas valide" });
    }
    if (!passRegex.test(password) && password != null) {
        return res.status(400).json({ 'error': "Le mot de passe n'est pas valide (doit comporter 4 à 15 caractères et inclure au moins 1 chiffre)" });
    }
    models.User.findOne({
        attributes: ['id', 'bio'],
        where: { id: req.params.id }
    })
        .then(userFound => {
            if (!userFound) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            } else {
                if (userFound.id != req.token.userId) {
                    return res.status(401).json({ message: 'Vous ne pouvez pas modifier ce profil' });
                }
                bcrypt.hash(req.body.password, 10, function (err, bcryptedPassword) {
                    userFound.update({
                        email: email ? email : userFound.email,
                        username: (username ? username : userFound.username),
                        password: bcryptedPassword,
                        bio: (bio ? bio : userFound.bio)
                    })
                })
            }
        })
        .then(() => res.status(200).json({ message: 'Profil modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Permet de supprimer le compte
exports.deleteProfile = (req, res) => {
    const userSignIn = req.token.userId;
    models.User.findOne({ id: req.params.id })
        .then(userFound => {
            if (userFound != null) {
                if (userFound.UserId != userSignIn && userSignIn.isAdmin) {
                    return res.status(401).json({ message: 'Vous ne pouvez pas supprimer ce profil' });
                }
                models.Post.destroy({
                    where: { userId: userSignIn }
                })
                models.User.destroy({
                    where: { id: userSignIn }
                })
                    .then(() => res.status(200).json({ message: 'Compte supprimé !' }))
                    //.catch(error => res.status(400).json({ error }));
            }
            else {
                res.status(401).json({ error: "Cet user n'existe pas" })
            }
        })
}
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const models = require('../models');
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passRegex = /^(?=.*\d).{4,15}$/;
//Permet l'inscription
exports.signup = (req, res, next) => {
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;

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
                        bio: "Vide",
                        isAdmin: false,
                        imageUrl:"http://localhost:3000/images/default300x300.jpg",
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
//Permet de se connecter
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
        attributes: ['id', 'email', 'username', 'bio', 'createdAt','isAdmin','imageUrl'],
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
    console.log(req.body);
    var bio = req.body.bio;
    var email = req.body.email;
    var password = req.body.password;
    var username = req.body.username;
    if(username!= "" && username!=null){
        if (username.length >= 13 || username.length <= 4) {
            return res.status(400).json({ 'error': 'Pseudo invalide (doit comporter 4 à 12 caractères)' });
        }
    }
    if (!emailRegex.test(email) && email != "" && email!=null) {
        return res.status(400).json({ 'error': "L'email n'est pas valide" });
    }
    if (!passRegex.test(password) && password != "" && password!= null ) {
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
                bcrypt.hash(password, 10, function (err, bcryptedPassword) {
                    userFound.update({
                        email: (email ? email : userFound.email),
                        username: (username ? username : userFound.username),
                        password:(password ? bcryptedPassword : userFound.password),
                        bio: (bio ? bio : userFound.bio),
                        imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : userFound.imageUrl
                    })
                })
            }
        })
        .then(() => res.status(200).json({ message: 'Profil modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

// Permet de supprimer le compte
exports.deleteProfile = (req, res) => {
    
    models.User.findOne({
        where:{ id: req.token.userId }
    })
    .then(userSignIn => {
        models.User.findOne({
            where:{ id: req.params.id }})
            .then(userFound => {
                if (userFound != null) {
                    if (userFound.id != userSignIn.id && !userSignIn.isAdmin) {
                        return res.status(401).json({ message: 'Vous ne pouvez pas supprimer ce profil' });
                    }
                    models.Post.destroy({
                        where: { userId: userFound.id }
                    })
                    models.User.destroy({
                        where: { id: userFound.id }
                    })
                        .then(() => res.status(200).json({ message: 'Compte supprimé !' }))
                        .catch(error => res.status(400).json({ error }));
                }
                else {
                    res.status(401).json({ error: "Cet user n'existe pas" })
                }
            })
    })
};
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const models = require('../models');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const newUser = models.User.create({
                email: req.body.email,
                username: username,
                password: hash,
                isAdmin: false
            })
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    models.User.findOne({ where: { email: email } })
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
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
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
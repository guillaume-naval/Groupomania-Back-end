const jwt = require('jsonwebtoken');
const models = require('../models');

module.exports = (req, res, next) => {
    await models.User.findOne({
        where: { id: req.token.userId }
    })
        .then(function (userFound) {
            if (userFound.isAdmin) {
                return true;
            } else {
                return false;
            }
        })

};
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../utils/database");

const Comment = sequelize.define("Comment", {
    // Model attributes are defined here
    content: {
        type: DataTypes.TEXT
    }
});

module.exports = Comment;
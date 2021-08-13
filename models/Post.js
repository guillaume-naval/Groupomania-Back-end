const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../utils/database");

const Post = sequelize.define("Post", {
    // Model attributes are defined here
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Post;
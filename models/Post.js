const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../utils/database");

const Post = sequelize.define("Post", {
    // Model attributes are defined here
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Post;
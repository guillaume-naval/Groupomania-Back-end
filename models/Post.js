const { Sequelize } = require('sequelize');
const sequelize = require("../utils/database");

const Post = sequelize.define("Post", {
    // Model attributes are defined here
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
});

module.exports = Post;
// the defined model is the class itself
console.log(Post === sequelize.models.Post); // true
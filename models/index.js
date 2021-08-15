const User = require('./User');
const Post = require('./Post');
const React = require('./React');
const Comment = require('./Comment');
const sequelize = require("../utils/database");

//Liste des relations entre les models
sequelize.sync();
User.hasMany(Post);
User.hasMany(Comment);
Post.belongsTo(User);
Post.hasMany(Comment);
Comment.belongsTo(Post);
Comment.belongsTo(User);
Post.hasMany(React);
React.belongsTo(Post);
React.belongsTo(User);

//création des relations entre les models
sequelize.sync();
const db = { User, Post, Comment, React };

module.exports = db;
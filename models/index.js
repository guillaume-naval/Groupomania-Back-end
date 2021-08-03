const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');
const sequelize = require("../utils/database");

User.hasMany(Post);
User.hasMany(Comment);
Post.belongsTo(User);
Post.hasMany(Comment);
Comment.belongsTo(Post);
Comment.belongsTo(User);

sequelize.sync();
const db = { User, Post, Comment };

module.exports = db;
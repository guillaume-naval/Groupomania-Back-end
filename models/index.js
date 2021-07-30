const User = require('./User');
const Post = require('./Post');
const sequelize = require("../utils/database");

User.hasMany(Post);
Post.belongsTo(User);


sequelize.sync({ force: true });
const db = { User, Post };

module.exports = db;
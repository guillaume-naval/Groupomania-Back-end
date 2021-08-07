const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../utils/database");

const React = sequelize.define("React", {
    // Model attributes are defined here
    reactType: {
        type: DataTypes.TEXT
    }
});

module.exports = React;
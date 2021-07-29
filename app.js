const express = require('express');
const { Sequelize } = require('sequelize');
const path = require('path');
const helmet = require('helmet');
const dotenv = require('dotenv').config();

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

try {
    sequelize.authenticate().then(function () {
        console.log('Connecté à la base de données MySQL');
    });
} catch (error) {
    console.error('Impossible de se connecter, erreur suivante :', error);
}

const app = express();
app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});


app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);

module.exports = app;
const Sequelize = require('sequelize');
require('dotenv').config();

const sql = new Sequelize(`mysql://${process.env.DB_USER}@${process.env.DB_HOST}:3306/testeo_delilah`);

module.exports = sql;

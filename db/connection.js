const Sequelize = require('sequelize');
require('dotenv').config();

const sql = new Sequelize(
	`mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_DB}`
);

module.exports = sql;

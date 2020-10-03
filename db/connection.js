const Sequelize = require('sequelize');
require('dotenv').config();

const sql = new Sequelize(process.env.CLEARDB_DATABASE_URL);

module.exports = sql;

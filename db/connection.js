const Sequelize = require('sequelize');
require('dotenv').config();

const sql = new Sequelize(`mysql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_DB}`);

module.exports = sql;

const Sequelize = require('sequelize');
require('dotenv').config();

const sql = new Sequelize(`mysql://b3b8419f087148:6ec29535@us-cdbr-east-02.cleardb.com/heroku_34ecf3590bb8583`);

module.exports = sql;

// mysql://b3b8419f087148:6ec29535@us-cdbr-east-02.cleardb.com/heroku_34ecf3590bb8583?reconnect=true

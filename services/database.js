const { dbConfig } = require('../config');
const mysql = require('mysql');
const util = require('util');

const connection =  mysql.createConnection(dbConfig);

const query = util.promisify(connection.query).bind(connection);

module.exports = query;
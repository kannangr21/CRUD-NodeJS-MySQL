require('dotenv').config()

module.exports = {
    server: {
        port: process.env.PORT || 8000
    },
    dbConfig: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USERNAME || '',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || ''
    },
    pageSize : 5
};
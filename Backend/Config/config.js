const mssql = require('mssql');
const dotenv = require('dotenv');

dotenv.config();

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: 'localhost',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: false,
    }
};

const pool = new mssql.ConnectionPool(sqlConfig);

pool.connect()
    .then(() => {
        console.log('Connected to the database successfully');
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
    });

module.exports = {
    sqlConfig,
    pool
};

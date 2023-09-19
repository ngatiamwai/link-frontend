const { pool } = require('./config');

beforeAll(async () => {
    // Wait for the database connection to be established before running tests
    await pool.connect();
});

afterAll(async () => {
    // Close the database connection after all tests are done
    await pool.close();
});

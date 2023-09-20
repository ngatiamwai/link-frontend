const { registerUser, userLogin } = require('./authControllers');
const mssql = require('mssql')
const bcryptjs = require('bcryptjs')
const jwt = require("jsonwebtoken");
jest.mock('jsonwebtoken')
jest.mock('bcryptjs');
jest.mock('mssql');

describe('registerUser Controller', () => {
  it('should input all values', async () => {
    // Mock the request object with valid user data
    const req = {
      body: {},
    };

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Call the controller function
    await registerUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("should register a new user successfully", async () => {
    // Mock the request object with valid user data
    const req = {
      body: {
        // Add user data here
        name: 'ngatia',
        username: 'ngatia',
        email: 'ngatia@gmail.com',
        password: '123456789',
        phone_number:"09217313617"
      },
    };

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking mssql.connect and related functions
    const mockedInput = jest.fn().mockReturnThis();
    const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
    const mockedRequest = {
      input: mockedInput,
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    const pool = jest.spyOn(mssql, "connect").mockResolvedValue(mockedPool);
    // Mock bcrypt.hash
    bcryptjs.hash.mockResolvedValue('hashed_password');

    // Execute the controller function
    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

  });

      it("should return an error if email or password is missing", async () => {
        const req = { body: {} };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };

         //   // Call the controller function
    await registerUser(req, res);

  //   // Assertions
    expect(res.status).toHaveBeenCalledWith(400);
    });



  it('should log in a user successfully', async () => {
    // Mock the request object with valid user login data
    const req = {
      body: {
        email: 'ngatia@gmail.com',
        password: '123456789',
      },
    };

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mocking mssql.connect and related functions
    const mockedInput = jest.fn().mockReturnThis();
    const mockedRequest = {
      input: mockedInput,
      execute: jest.fn().mockResolvedValue({
        recordset: [
          // Mock the user data returned from the database
          {
            id: 1,
            role: 'user',
            // Add other user properties here
          },
        ],
      }),
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Mock bcrypt.compare to return true for password comparison
    bcryptjs.compare.mockResolvedValue(true);

    // Mock jwt.sign to return a sample token
    jwt.sign.mockReturnValue('sample_token');

    // Execute the controller function
    await userLogin(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      role: 'user',
      message: 'Logged in',
      token: 'sample_token',
    });
  });

});

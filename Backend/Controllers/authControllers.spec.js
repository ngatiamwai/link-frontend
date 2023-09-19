const { registerUser } = require('./authControllers');


jest.mock('mssql');

describe('registerUser Controller', () => {
  it('should register a user successfully', async () => {
    // Mock the request object with valid user data
    const req = {
      body: {
        name: 'John Doe',
        username: 'johndoe123',
        email: 'johndoe@example.com',
        password: 'password123',
        phone_number: '1234567890',
      },
    };

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock bcrypt.hash to return a hashed password
    jest.spyOn(require('bcryptjs'), 'hash').mockResolvedValue('hashed_password');

    // Mock the pool connection to simulate a successful connection
    const mockPool = {
      connect: jest.fn().mockResolvedValue(),
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ rowsAffected: [1] }),
    };

    require('mssql').ConnectionPool.mockReturnValue(mockPool);

    // Call the controller function
    await registerUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
  });

  // Add other test cases for error scenarios and validations as needed
});

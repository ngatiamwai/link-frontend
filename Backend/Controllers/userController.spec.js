const { updateUser, oneUser } = require("./userController");
const mssql = require('mssql')

jest.mock('mssql')

describe('User Controller', () => {
it('should update user details', async () => {

    const req = {
        params: {
            id: 'piuqHWR7-83IOsdkdMSCioas', 
          },
        body: {
          name: 'ngatia',
          username: 'ngatia',
          email: 'ngatia@gmail.com',
          phone_number:"09217313617",
          profilePic:"/Frontend/Images/building-patient-doctor-trust.jpg"
        },
      };
  
      // Mock the response object
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    const mockedRowsAffected = [ 1 ];
    const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: mockedRowsAffected });
    const mockedRequest = {
        input: jest.fn().mockReturnThis(),
        execute: mockedExecute
    };
    const mockedPool = {
        request: jest.fn().mockReturnValue(mockedRequest)
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    await updateUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
});


it('should handle user not found', async () => {
    // Mock the request object with valid user data and user ID
    const req = {
      params: {
        id: 'non_existent_user_id', // Replace with a user ID that doesn't exist in your database
      },
      body: {
        name: 'mwai',
        username: 'mwai',
        email: 'mwai@gmail.com',
        phone_number: '1234567890',
        profilePic: '/profilePic.jpg',
      },
    };

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the database functions to simulate user not found
    const mockedRowsAffected = [0]; // Simulate that no rows were affected (user not found)
    const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: mockedRowsAffected });
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Execute the controller function
    await updateUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });


  it('should fetch a user by ID successfully', async () => {
    // Mock the request object with a valid user ID
    const req = {
      params: {
        id: 'e6ryuio576890tyuio vbnm,bnm,', // Replace with a valid user ID
      },
    };

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the database functions
    const mockedUser = {
        id: 'yuio7689tyui789o9p;l;urtd9fu',
        name: 'mwai',
        username: 'mwai',
        email: 'mwai@gmail.com',
        phone_number: '1234567890',
        profilePic: '/profilePic.jpg',
    };
    
    const mockedExecute = jest.fn().mockResolvedValue({ recordset: [mockedUser] });
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Execute the controller function
    await oneUser(req, res);

    // Assertions
    expect(res.json).toHaveBeenCalledWith({ user: mockedUser });
  });

  it('should handle user not found', async () => {
    // Mock the request object with an invalid user ID
    const req = {
      params: {
        id: '23456789iuytrewdfghy67iuoiy', // Replace with a user ID that doesn't exist in your database
      },
    };

    // Mock the response object
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock the database functions to simulate user not found
    const mockedExecute = jest.fn().mockResolvedValue({ recordset: [] }); // Simulate an empty result (user not found)
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Execute the controller function
    await oneUser(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(404);
  });
});

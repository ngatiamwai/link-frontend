const mssql  = require('mssql');
const { followPerson, unfollowPerson, yourFollowers, getPersonsYouAreFollowing } = require('./followController');

jest.mock('mssql')

describe('Follow Controller', () => {
  it('should follow a user successfully', async () => {
    // Mock the parameters in the request
    const followerId = '123'; // Replace with the desired followerId for testing
    const followingId = '456'; // Replace with the desired followingId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        followerId: followerId,
        followingId: followingId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database follow result
    const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await followPerson(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith({ message: 'You are now following this user.' }); // Expect success message in JSON response
  });

  it('should return an error when follow fails', async () => {
    // Mock the parameters in the request
    const followerId = '123'; // Replace with the desired followerId for testing
    const followingId = '456'; // Replace with the desired followingId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        followerId: followerId,
        followingId: followingId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database follow result
    const errorMessage = 'Database error';
    const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await followPerson(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while following the user.',
    }); // Expect error message in JSON response
  });

  it('should unfollow a user successfully', async () => {
    // Mock the parameters in the request
    const followerId = '123'; // Replace with the desired followerId for testing
    const followingId = '456'; // Replace with the desired followingId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        followerId: followerId,
        followingId: followingId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database unfollow result
    const mockedExecute = jest.fn().mockResolvedValue({ rowsAffected: [1] });
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await unfollowPerson(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith({
      message: 'You have successfully unfollowed this user.',
    }); // Expect success message in JSON response
  });

  it('should return an error when unfollow fails', async () => {
    // Mock the parameters in the request
    const followerId = '123'; // Replace with the desired followerId for testing
    const followingId = '456'; // Replace with the desired followingId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        followerId: followerId,
        followingId: followingId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database unfollow result
    const errorMessage = 'Database error';
    const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await unfollowPerson(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while unfollowing the user.',
    }); // Expect error message in JSON response
  });

  it('should retrieve followers successfully', async () => {
    // Mock the followerId parameter in the request
    const followerId = '123'; // Replace with the desired followerId for testing

    // Mock the request object with the followerId parameter
    const req = {
      params: {
        followerId: followerId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database result with followers
    const mockFollowers = [
      { userId: '456', username: 'user1' },
      { userId: '789', username: 'user2' },
    ];
    const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockFollowers });
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await yourFollowers(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith(mockFollowers); // Expect followers in JSON response
  });

  it('should return an error when retrieval fails', async () => {
    // Mock the followerId parameter in the request
    const followerId = '123'; // Replace with the desired followerId for testing

    // Mock the request object with the followerId parameter
    const req = {
      params: {
        followerId: followerId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database result
    const errorMessage = 'Database error';
    const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await yourFollowers(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while getting your followers.',
    }); // Expect error message in JSON response
  });


  it('should retrieve persons you are following successfully', async () => {
    // Mock the userId parameter in the request
    const userId = '123'; // Replace with the desired userId for testing

    // Mock the request object with the userId parameter
    const req = {
      params: {
        userId: userId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database result with persons you are following
    const mockPersons = [
      { userId: '456', username: 'user1' },
      { userId: '789', username: 'user2' },
    ];
    const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockPersons });
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await getPersonsYouAreFollowing(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith(mockPersons); // Expect persons you are following in JSON response
  });

  it('should return an error when retrieval fails', async () => {
    // Mock the userId parameter in the request
    const userId = '123'; // Replace with the desired userId for testing

    // Mock the request object with the userId parameter
    const req = {
      params: {
        userId: userId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database result
    const errorMessage = 'Database error';
    const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await getPersonsYouAreFollowing(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while fetching persons you are following.',
    }); // Expect error message in JSON response
  });
});

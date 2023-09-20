const mssql = require('mssql');
const { likePost, unlikePost } = require('./likeController');

jest.mock('mssql')

describe('Liking Controller', () => {
  it('should like a post successfully', async () => {
    // Mock the parameters in the request
    const postId = '123'; // Replace with the desired postId for testing
    const userId = '456'; // Replace with the desired userId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        postId: postId,
        userId: userId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database post like result
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
    await likePost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith({ message: 'Post liked successfully' }); // Expect success message in JSON response
  });

  it('should return an error when post like fails', async () => {
    // Mock the parameters in the request
    const postId = '123'; // Replace with the desired postId for testing
    const userId = '456'; // Replace with the desired userId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        postId: postId,
        userId: userId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database post like result
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
    await likePost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while liking the post',
    }); // Expect error message in JSON response
  });


  it('should unlike a post successfully', async () => {
    // Mock the parameters in the request
    const postId = '123'; // Replace with the desired postId for testing
    const userId = '456'; // Replace with the desired userId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        postId: postId,
        userId: userId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database post unlike result
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
    await unlikePost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith({ message: 'Post unliked successfully' }); // Expect success message in JSON response
  });

  it('should return an error when post unlike fails', async () => {
    // Mock the parameters in the request
    const postId = '123'; // Replace with the desired postId for testing
    const userId = '456'; // Replace with the desired userId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        postId: postId,
        userId: userId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database post unlike result
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
    await unlikePost(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while unliking the post',
    }); // Expect error message in JSON response
  });

});

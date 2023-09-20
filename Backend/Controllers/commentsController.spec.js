const { createComment, allCommentsByPostId, allCommentsByuserId, deleteComment } = require("./commentsController");
const mssql = require('mssql')

jest.mock('mssql')

describe('Comments Controller', () => {
  it('should create a comment successfully', async () => {
    // Mock the userId and postId parameters in the request
    const userId = '123456'; // Replace with the desired userId for testing
    const postId = '789012'; // Replace with the desired postId for testing

    // Mock the request object with the userId, postId, and comment data
    const req = {
      params: {
        userId: userId,
        postId: postId,
      },
      body: {
        commentText: 'Test Comment', // Replace with the desired comment text
        commentPic: 'comment.jpg', // Replace with the desired comment picture
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database comment creation result
    const mockResult = {
      rowsAffected: [1],
    };
    const mockedExecute = jest.fn().mockResolvedValue(mockResult);
    const mockedRequest = {
        input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await createComment(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith({ message: 'Comment uploaded successfully' }); // Expect success message in JSON response
  });

  it('should return an error when comment creation fails', async () => {
    // Mock the userId and postId parameters in the request
    const userId = '123456'; // Replace with the desired userId for testing
    const postId = '789012'; // Replace with the desired postId for testing

    // Mock the request object with the userId, postId, and comment data
    const req = {
      params: {
        userId: userId,
        postId: postId,
      },
      body: {
        commentText: 'Test Comment', // Replace with the desired comment text
        commentPic: 'comment.jpg', // Replace with the desired comment picture
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database comment creation result
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
    await createComment(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: `An error occurred while creating the comment: ${errorMessage}`,
    }); // Expect error message in JSON response
  });


  it('should retrieve comments by postId successfully', async () => {
    // Mock the postId parameter in the request
    const postId = '123456'; // Replace with the desired postId for testing

    // Mock the request object with the postId parameter
    const req = {
      params: {
        postId: postId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database comment retrieval result
    const mockComments = [
      { commentId: '1', commentText: 'Comment 1' },
      { commentId: '2', commentText: 'Comment 2' },
    ];
    const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockComments });
    const mockedRequest = {
        input: jest.fn().mockReturnThis(),
      query: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await allCommentsByPostId(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith({ allPostsComments: mockComments }); // Expect comments in JSON response
  });

  it('should return an error when comment retrieval fails', async () => {
    // Mock the postId parameter in the request
    const postId = '123456'; // Replace with the desired postId for testing

    // Mock the request object with the postId parameter
    const req = {
      params: {
        postId: postId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database comment retrieval result
    const errorMessage = 'Database error';
    const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockedRequest = {
        input: jest.fn().mockReturnThis(),
      query: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await allCommentsByPostId(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while retrieving the comments.',
    }); // Expect error message in JSON response
  });


  it('should retrieve comments by userId successfully', async () => {
    // Mock the UserId parameter in the request
    const userId = '123456'; // Replace with the desired UserId for testing

    // Mock the request object with the UserId parameter
    const req = {
      params: {
        userId: userId
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database comment retrieval result
    const mockComments = [
      { commentId: '1', commentText: 'Comment 1' },
      { commentId: '2', commentText: 'Comment 2' },
    ];
    const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockComments });
    const mockedRequest = {
        input: jest.fn().mockReturnThis(),
      query: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await allCommentsByuserId(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith({ allUserComments: mockComments }); // Expect comments in JSON response
  });

  it('should return an error when comment retrieval fails', async () => {
    // Mock the UserId parameter in the request
    const userId = '123456'; // Replace with the desired UserId for testing

    // Mock the request object with the UserId parameter
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

    // Mock an error database comment retrieval result
    const errorMessage = 'Database error';
    const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
    const mockedRequest = {
        input: jest.fn().mockReturnThis(),
      query: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await allCommentsByuserId(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while retrieving the comments.',
    }); // Expect error message in JSON response
  });


  it('should delete a comment successfully', async () => {
    // Mock the parameters in the request
    const userId = '123'; // Replace with the desired userId for testing
    const commentId = '456'; // Replace with the desired commentId for testing
    const postId = '789'; // Replace with the desired postId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        userId: userId,
        commentId: commentId,
        postId: postId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock a successful database comment deletion result
    const mockedExecute = jest.fn().mockResolvedValue({ returnValue: 0 });
    const mockedRequest = {
      input: jest.fn().mockReturnThis(),
      execute: mockedExecute,
    };
    const mockedPool = {
      request: jest.fn().mockReturnValue(mockedRequest),
    };
    jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

    // Call the controller function
    await deleteComment(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    expect(res.json).toHaveBeenCalledWith({ message: 'Comment deleted successfully' }); // Expect success message in JSON response
  });

  it('should return an error when comment deletion fails', async () => {
    // Mock the parameters in the request
    const userId = '123'; // Replace with the desired userId for testing
    const commentId = '456'; // Replace with the desired commentId for testing
    const postId = '789'; // Replace with the desired postId for testing

    // Mock the request object with the parameters
    const req = {
      params: {
        userId: userId,
        commentId: commentId,
        postId: postId,
      },
    };

    // Mock the response object
    const res = {
      json: jest.fn(), // Mock the json function
      status: jest.fn().mockReturnThis(), // Mock the status function
    };

    // Mock an error database comment deletion result
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
    await deleteComment(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while deleting the comment.',
    }); // Expect error message in JSON response
  });

});

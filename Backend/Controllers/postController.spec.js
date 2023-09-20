const mssql = require('mssql')
const bcryptjs = require('bcryptjs');
const { uploadPost, allPosts, getOnePost, getPostsByUserId, deletePost, updatePost } = require('./postController');


jest.mock('mssql');

describe('Posts Controller', () => {

    it('should handle empty postName', async () => {
        // Mock the request object with an empty postName
        const req = {
            params: {
                userId: '23456789iuytrewdfghy67iuoiy',
            },
            body: {
                postName: '',
            },
        };

        // Mock the response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the controller function
        await uploadPost(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Please input all values' });
    });

    it('should Upload a post', async () => {
        // Mock the request object with valid user data
        const req = {
            params: {
                userId: '23456789iuytrewdfghy67iuoiy',
            },
            body: {
                // Add post data here
                postName: 'Sample Post',
                postPic: 'sample.jpg',
            },
        };

        // Mock the response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Mock the database functions to simulate a successful post upload
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
        await uploadPost(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post uploaded successfully' });
    });


    it('should get all posts successfully', async () => {
        // Mock the response data (replace with your test data)
        const mockPosts = [
            { postId: '1', postName: 'Post 1', postPic: 'pic1.jpg' },
            { postId: '2', postName: 'Post 2', postPic: 'pic2.jpg' },
        ];

        // Mock the request object
        const req = {};

        // Mock the response object
        const res = {
            json: jest.fn(), // Mock the json function
        };

        // Mock the database call to return the mockPosts data
        const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockPosts });
        const mockedRequest = {
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Call the controller function
        await allPosts(req, res);

        // Assertions
        expect(res.json).toHaveBeenCalledWith({ posts: mockPosts });
    });


    it('should get one post successfully', async () => {
        // Mock the postId parameter in the request
        const postId = '1'; // Replace with the desired postId for testing

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

        // Mock the database call to return a single post
        const mockPost = {
            postId: postId,
            postName: 'Test Post',
            postPic: 'test.jpg',
        };
        const mockedExecute = jest.fn().mockResolvedValue({ recordset: [mockPost] });
        const mockedRequest = {
            input:jest.fn().mockReturnThis(),
            query: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Call the controller function
        await getOnePost(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200
        expect(res.json).toHaveBeenCalledWith({ post: mockPost }); // Expect JSON response with the post
    });



    it('should return posts for a valid userId', async () => {
        // Mock the userId parameter in the request
        const userId = '123456'; // Replace with the desired userId for testing

        // Mock the request object with the userId parameter
        const req = {
            params: {
                id: userId,
            },
        };

        // Mock the response object
        const res = {
            json: jest.fn(), // Mock the json function
            status: jest.fn().mockReturnThis(), // Mock the status function
        };

        // Mock the database call to return a list of posts
        const mockPosts = [
            {
                postId: '1',
                postName: 'Post 1',
                postPic: 'pic1.jpg',
            },
            {
                postId: '2',
                postName: 'Post 2',
                postPic: 'pic2.jpg',
            },
        ];
        const mockedExecute = jest.fn().mockResolvedValue({ recordset: mockPosts });
        const mockedRequest = {
            input:jest.fn().mockReturnThis(),
            query: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Call the controller function
        await getPostsByUserId(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200
        expect(res.json).toHaveBeenCalledWith({ posts: mockPosts }); // Expect JSON response with posts
    });

    it('should return an error for an invalid userId', async () => {
        // Mock an invalid userId
        const userId = 'invalid_id';

        // Mock the request object with the invalid userId
        const req = {
            params: {
                id: userId,
            },
        };

        // Mock the response object
        const res = {
            json: jest.fn(), // Mock the json function
            status: jest.fn().mockReturnThis(), // Mock the status function
        };

        // Mock an error during database query
        const errorMessage = 'Database error';
        const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
        const mockedRequest = {
            query: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Call the controller function
        await getPostsByUserId(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
        expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while retrieving posts.' }); // Expect error message in JSON response
    });


    it('should delete a post successfully', async () => {
        // Mock the postId and userId parameters in the request
        const postId = '123456'; // Replace with the desired postId for testing
        const userId = '789012'; // Replace with the desired userId for testing

        // Mock the request object with the postId and userId parameters
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

        // Mock a successful database deletion result
        const mockResult = {
            recordset: [
                {
                    Message: 'Post deleted successfully.',
                },
            ],
        };
        // const mockedExecute =;
        const mockedRequest = {
            input: jest.fn().mockReturnThis(),
            execute:  jest.fn().mockResolvedValue(mockResult),
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Call the controller function
        await deletePost(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(200); // Expect status to be 200 (success)
    });

    it('should return an error when post deletion fails', async () => {
        // Mock the postId and userId parameters in the request
        const postId = '123456'; // Replace with the desired postId for testing
        const userId = '789012'; // Replace with the desired userId for testing

        // Mock the request object with the postId and userId parameters
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

        // Mock an error database deletion result
        const errorMessage = 'Database error';
        const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
        const mockedRequest = {
            execute: mockedExecute,
        };
        const mockedPool = {
            request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Call the controller function
        await deletePost(req, res);

        // Assertions
        expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
        expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while deleting the post.' }); // Expect error message in JSON response
    });


    it('should update a post successfully', async () => {
        // Mock the postId parameter in the request
        const postId = '123456'; // Replace with the desired postId for testing
    
        // Mock the request object with the postId parameter and updated post data
        const req = {
          params: {
            postId: postId,
          },
          body: {
            postName: 'Updated Post Name', // Replace with the updated post name
            postPic: 'updated.jpg', // Replace with the updated post picture
          },
        };
    
        // Mock the response object
        const res = {
          json: jest.fn(), // Mock the json function
          status: jest.fn().mockReturnThis(), // Mock the status function
        };
    
        // Mock a successful database update result
        // const mockedRowsAffected = [ 1 ];

    const mockedRequest = {
        input: jest.fn().mockReturnThis(),
        query: jest.fn().mockResolvedValue({ rowsAffected: [1] })
    };
    const mockedPool = {
        request: jest.fn().mockReturnValue(mockedRequest)
    };
const request =   jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);

        // Call the controller function
        await updatePost(req, res);
    
    
        // Assertions
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Post updated successfully' }); // Expect success message in JSON response
      });
    
    
      it('should return an error when post update fails', async () => {
        // Mock the postId parameter in the request
        const postId = '123456'; // Replace with the desired postId for testing
    
        // Mock the request object with the postId parameter and updated post data
        const req = {
          params: {
            postId: postId,
          },
          body: {
            postName: 'Updated Post Name', // Replace with the updated post name
            postPic: 'updated.jpg', // Replace with the updated post picture
          },
        };
    
        // Mock the response object
        const res = {
          json: jest.fn(), // Mock the json function
          status: jest.fn().mockReturnThis(), // Mock the status function
        };
    
        // Mock an error database update result
        const errorMessage = 'Database error';
        const mockedExecute = jest.fn().mockRejectedValue(new Error(errorMessage));
        const mockedRequest = {
          execute: mockedExecute,
        };
        const mockedPool = {
          request: jest.fn().mockReturnValue(mockedRequest),
        };
        jest.spyOn(mssql, 'connect').mockResolvedValue(mockedPool);
    
        // Call the controller function
        await updatePost(req, res);
    
        // Assertions
        expect(res.status).toHaveBeenCalledWith(500); // Expect status to be 500 (error)
        expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while updating the post.' }); // Expect error message in JSON response
      });

})
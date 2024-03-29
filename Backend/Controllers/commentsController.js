const mssql = require('mssql');
const { v4 } = require('uuid');
const dotenv = require('dotenv');
const { sqlConfig } = require('../Config/config');

dotenv.config();

const createComment = async (req, res, next) => {
  try {
    const commentId = v4();
    const { userId, postId } = req.params;
    const { commentText, commentPic } = req.body;

    console.log(userId, postId, commentText, commentPic);

    if (!commentText || !userId || !postId || !commentPic) {
      return res.status(400).json({
        error: 'Please provide commentText, userId, and postId.',
      });
    }

    const pool = await mssql.connect(sqlConfig);

    const response = await pool.request()
    .input('commentId',  commentId)
    .input('commentText',  commentText)
    .input('commentPic',  commentPic) // Use null if commentPic is not provided
    .input('userId',  userId)
    .input('postId',  postId)
    .execute('createComment')


    if (response.rowsAffected[0] == 1) {
      return res.status(200).json({ message: 'Comment uploaded successfully' });
    } else {
      return res.status(400).json({ message: 'Comment upload failed' });
    }
  } catch (error) {
    console.error('Error creating comment:', error);
    return res.status(500).json({
      error: `An error occurred while creating the comment: ${error.message}`,
    });
  }
};

//Get all comments by postId
const allCommentsByPostId = async (req, res) => {
  try {
    const { postId: postId } = req.params; // Get postId from route parameter
    console.log('Received postId:', postId);

    const pool = await mssql.connect(sqlConfig);

    // Fetch posts by postId from the posts table
    const query = `SELECT * FROM comments WHERE postId = @postId`;
    const result = await pool.request()
    .input('postId', mssql.VarChar, postId).query(query);

    const allPostsComments = result.recordset;

    return res.status(200).json({ allPostsComments: allPostsComments });
  } catch (error) {
    console.error('Error retrieving comments by postId:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving the comments.' });
  }
};


//Get all comments by userId
const allCommentsByuserId = async (req, res) => {
  try {
    const { userId: userId } = req.params; // Get userId from route parameter
    console.log('Received userId:', userId);

    const pool = await mssql.connect(sqlConfig);

    // Fetch users by userId from the users table
    const query = `SELECT * FROM comments WHERE userId = @userId`;
    const result = await pool.request()
    .input('userId', mssql.VarChar, userId).query(query);

    const allUserComments = result.recordset;

    return res.status(200).json({ allUserComments: allUserComments });
  } catch (error) {
    console.error('Error retrieving comments by userId:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving the comments.' });
  }
};


//Delete comment
const deleteComment = async (req, res) => {
  try {
    const { userId ,commentId, postId } = req.params; // Get commentId from route parameters

    const pool = await mssql.connect(sqlConfig);

    // Use input only for commentId
    // const query = `EXEC DeleteComment @commentId`;

    const result = await pool
      .request()
      .input('userId', userId)
      .input('postId', postId)
      .input('commentId',  commentId)
      .execute('DeleteComment');

    // Check if any rows were affected to determine if the comment was deleted
    if (result.returnValue === 0) {
      return res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      return res.status(404).json({ error: 'Comment not found or you do not have permission to delete it.' });
    }
  } catch (error) {
    console.error('Error deleting comment by commentId:', error);
    return res.status(500).json({ error: 'An error occurred while deleting the comment.' });
  }
};



const subComment = async (req, res) => {
  try {
    const { userId, commentId } = req.params;

  console.log(userId, commentId)
    const { subCommentText } = req.body;
    console.log(subCommentText);

    if (!commentId || !userId || !subCommentText) {
      return res.status(400).json({ error: 'Please provide commentId, userId, and subCommentText.' });
    }

    const subcommentId = v4(); 
    const createdAt = new Date(); 

    const pool = await mssql.connect(sqlConfig);

    const result = await pool
      .request()
      .input('subcommentId', mssql.VarChar(200), subcommentId)
      .input('commentId', mssql.VarChar(200), commentId)
      .input('userId', mssql.VarChar(200), userId)
      .input('subCommentText', mssql.VarChar(200), subCommentText)
      .input('createdAt', mssql.DateTime, createdAt)
      .execute('insertSubComment'); 

    if (result.rowsAffected[0] === 1) {
      console.log(result);
      return res.status(201).json({ message: 'Sub-comment inserted successfully' });
    } else {
      return res.status(500).json({ error: 'Failed to insert sub-comment' });
      
    }
    
  } catch (error) {
    console.error('Error inserting sub-comment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


////Update Comment
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params; // Get the commentId from the request parameters
    const { commentText, commentPic } = req.body; // Get updated comment data from the request body

    console.log(commentId , commentText, commentPic)

    const pool = await mssql.connect(sqlConfig);

    const result = await pool
    .request()
    .input('commentId', commentId)
    .input('commentText', commentText)
    .input('commentPic', commentPic)
    .execute('UpdateComment')

    if (result.rowsAffected[0] === 1) {
      return res.status(200).json({ message: 'Comment updated successfully' });
    } else {
      return res.status(404).json({ error: 'Comment not found or update failed.' });
    }
  } catch (error) {
    console.error('Error updating comment:', error);
    return res.status(500).json({ error: 'An error occurred while updating the comment.' });
  }
};



module.exports = {
  createComment,
  allCommentsByPostId,
  allCommentsByuserId,
  deleteComment,
  subComment,
  updateComment
};

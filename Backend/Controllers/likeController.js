const mssql = require('mssql')
const { v4 } = require('uuid')
const dotenv = require('dotenv')
const { sqlConfig } = require('../Config/config')

dotenv.config()

// Controller function to like a post
async function likePost(req, res) {
    const { postId, userId } = req.body;

    try {
        const request = new mssql.Request();
        const query = `
        -- Check if the user has already liked the post
        IF NOT EXISTS (SELECT 1 FROM likes WHERE postId = @postId AND userId = @userId)
        BEGIN
            -- User has not liked the post, insert a new like
            INSERT INTO likes (likeId, postId, userId, likedDate)
            VALUES (NEWID(), @postId, @userId, GETDATE());
        END
      `;

        request.input('postId', mssql.VarChar(200), postId);
        request.input('userId', mssql.VarChar(200), userId);

        await request.query(query);
        res.status(200).json({ message: 'Post liked successfully' });
    } catch (error) {
        console.error('Error liking the post:', error);
        res.status(500).json({ error: 'An error occurred while liking the post' });
    }
}



// Controller function to unlike a post
async function unlikePost(req, res) {
    const { postId, userId } = req.body;

    try {
        const request = new mssql.Request();
        const query = `
      -- Check if the user has liked the post
      IF EXISTS (SELECT 1 FROM likes WHERE postId = @postId AND userId = @userId)
      BEGIN
          -- User has liked the post, delete the like
          DELETE FROM likes WHERE postId = @postId AND userId = @userId;
      END
    `;

        request.input('postId', mssql.VarChar(200), postId);
        request.input('userId', mssql.VarChar(200), userId);

        await request.query(query);
        res.status(200).json({ message: 'Post unliked successfully' });
    } catch (error) {
        console.error('Error unliking the post:', error);
        res.status(500).json({ error: 'An error occurred while unliking the post' });
    }
}

module.exports = {
    likePost,
    unlikePost,
};

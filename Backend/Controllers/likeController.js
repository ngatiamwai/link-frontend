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


///get liked posts by userId
const getLikedPostsByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const pool = await mssql.connect(sqlConfig);
  
      const result = await pool
        .request()
        .input('userId', mssql.VarChar(200), userId)
        .execute('getLikedPostsByUser');
  
      const likedPosts = result.recordset;
  
      if (likedPosts.length > 0) {
        return res.status(200).json(likedPosts);
      } else {
        return res.status(404).json({ message: 'No liked posts found for the user.' });
      }
    } catch (error) {
      console.error('Error fetching liked posts:', error);
      return res.status(500).json({ error: 'An error occurred while fetching liked posts.' });
    }
  };

module.exports = {
    likePost,
    unlikePost,
    getLikedPostsByUser
};

const mssql = require('mssql')
const { v4 } = require('uuid')
const dotenv = require('dotenv')
const { sqlConfig } = require('../Config/config')

dotenv.config()

// Controller function to like a post
async function likePost(req, res) {
  try {
    const { postId, userId } = req.params;
    const likeId = v4()

      const pool = await mssql.connect(sqlConfig);
        const result = await pool.request()
      .input('likeId', likeId)
      .input('postId', mssql.VarChar(200), postId)
      .input('userId', mssql.VarChar(200), userId)
      .execute('LikePost')


      if (result.rowsAffected[0] == 1) {
        res.status(200).json({ message: 'Post liked successfully' });
      } else {
        res.status(400).json({ message: "Post was not liked" });
      }

    } catch (error) {
        console.error('Error liking the post:', error);
        res.status(500).json({ error: 'An error occurred while liking the post' });
    }
}



// Controller function to unlike a post
async function unlikePost(req, res) {
  try {
    const { postId, userId } = req.params;

    const pool = await mssql.connect(sqlConfig)

    const result = await pool.request()
    .input('postId', mssql.VarChar(200), postId)
    .input('userId', mssql.VarChar(200), userId)
    .execute('UnlikePost')


    if (result.rowsAffected[0] == 1) {
      res.status(200).json({ message: 'Post unliked successfully' });
    } else {
      res.status(400).json({ message: "Post was not unliked" });
    }
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

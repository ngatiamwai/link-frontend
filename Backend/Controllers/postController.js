const mssql = require("mssql");
const { v4 } = require("uuid");

const dotenv = require("dotenv");
const { sqlConfig } = require("../Config/config");
dotenv.config();

const uploadPost = async (req, res) => {
  try {
    const postId = v4();
    const { userId } = req.params;

    const { postName, postPic } = req.body;

    console.log(postId, postName, userId);

    if (!postName) {
      return res.status(400).json({
        error: "Please input all values",
      });
    }

    const pool = await mssql.connect(sqlConfig);

    const result = await pool
      .request()
      .input("postId", postId)
      .input("postName", mssql.VarChar, postName)
      .input("postPic", mssql.VarChar, postPic)
      .input("userId", mssql.VarChar, userId)
      .execute("UploadPostProc");

    if (result.rowsAffected[0] == 1) {
      return res.status(200).json({ message: "Post uploaded successfully" });
    } else {
      return res.status(400).json({ message: "Post upload failed" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




//All Posts
const allPosts = async (req, res) => {
  try {
    const pool = await mssql.connect(sqlConfig);

    const allPosts = (await pool.request().execute('fetchAllPosts'))
      .recordset;

    res.json({ posts: allPosts });
  } catch (error) {
    return res.json({ error });
  }
}

//Get one Post
const getOnePost = async (req, res) => {
  try {
    const { postId: postId } = req.params; // Get postId from route parameter
    console.log('Received postId:', postId);

    const pool = await mssql.connect(sqlConfig);

    // Fetch posts by postId from the posts table
    const query = `SELECT * FROM posts WHERE postId = @postId`;
    const result = await pool.request()
    .input('postId', mssql.VarChar, postId).query(query);

    const post = result.recordset;

    return res.status(200).json({ post: post });
  } catch (error) {
    console.error('Error retrieving post by postId:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving the post.' });
  }
};




//One your Posts by userID 
const getPostsByUserId = async (req, res) => {
  try {
    const { id: userId } = req.params; // Get userId from route parameter
    console.log('Received userId:', userId);

    const pool = await mssql.connect(sqlConfig);

    // Fetch posts by userId from the posts table
    const query = `SELECT * FROM posts WHERE userId = @userId`;
    const result = await pool.request()
    .input('userId', mssql.VarChar, userId).query(query);

    const posts = result.recordset;

    return res.status(200).json({ posts: posts });
  } catch (error) {
    console.error('Error retrieving posts by userId:', error);
    return res.status(500).json({ error: 'An error occurred while retrieving posts.' });
  }
};

/// Delete Post
const deletePost = async (req, res) => {
  try {
    const { postId, userId } = req.params;

    const pool = await mssql.connect(sqlConfig);
    const result = await pool
      .request()
      .input('postId', postId)
      .input('userId', userId)
      .execute('DeletePostAndLikes');

    // Check the result for success or error message
    if (result.recordset[0] && result.recordset[0].Message) {
      const successMessage = "Post deleted successfully.";
      res.status(200).json({ message: successMessage });
    } else {
      res.status(500).json({ error: 'Error deleting post and associated likes' });
    }
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ error: 'An error occurred while deleting the post.' });
  }
};



////update post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params; // Get the postId from the request parameters
    const { postName, postPic } = req.body; // Get updated post data from the request body

    console.log(postId, postName, postPic);

    const pool = await mssql.connect(sqlConfig);

    const request = pool.request();
    request.input('postId', postId);
    request.input('postName', postName); // Pass the updated postName
    request.input('postPic', postPic);     // Pass the updated postPic (even if it's undefined)

    const result = await request.query(`
      EXEC updatePost @postId, @postName, @postPic
    `);

    if (result.rowsAffected[0] === 1) {
      return res.status(200).json({ message: 'Post updated successfully' });
    } else {
      return res.status(404).json({ error: 'Post not found or update failed.' });
    }
  } catch (error) {
    console.error('Error updating post:', error);
    return res.status(500).json({ error: 'An error occurred while updating the post.' });
  }
};





module.exports = {
  uploadPost,
  allPosts,
  getOnePost,
  getPostsByUserId,
  deletePost,
  updatePost
};

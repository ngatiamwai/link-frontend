const mssql = require("mssql");
const { sqlConfig } = require("../../Config/config");

//usersTable
const createUsersTable = async () => {
  try {
    const table = `
    BEGIN TRY
CREATE TABLE userTable(
        id VARCHAR(200) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,   
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user', 
        phone_number INT,
        updated_at DATETIME,
        resetToken VARCHAR(200),
        resetTokenExpiry DATETIME, 
    );
END TRY
BEGIN CATCH
    THROW 50001, 'Table already exists!', 1;
END CATCH;`

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("Table created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};


///postsTable
const createPostsTable = async () => {
  try {
    const table = `
    BEGIN 
TRY
CREATE TABLE posts(
    postId VARCHAR(200) PRIMARY KEY,
    postName VARCHAR(200) NOT NULL,
    postPic VARCHAR (200),
    updated_at DATETIME,
    userId VARCHAR(200),
    -- name VARCHAR(255),
    -- username VARCHAR(100),
    FOREIGN KEY (userId) REFERENCES userTable(id) ON UPDATE CASCADE ON DELETE CASCADE,
    -- FOREIGN KEY (name, username) REFERENCES userTable(name, username) ON UPDATE CASCADE ON DELETE CASCADE
);
END TRY
BEGIN CATCH
THROW 50001, 'Error occured when creating post table', 1 ;
END CATCH`

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("Table created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};



///commentsTable
const createCommentsTable = async () => {
  try {
    const table = `
    BEGIN TRY
    CREATE TABLE comments (
        commentId VARCHAR(200) PRIMARY KEY,
        commentText VARCHAR(200) NOT NULL,
        commentPic VARCHAR(200), 
        userId VARCHAR(200) NOT NULL,
        postId VARCHAR(200) NOT NULL,
        FOREIGN KEY (userId) REFERENCES userTable(id),
        FOREIGN KEY (postId) REFERENCES posts(postId)
    );
    END TRY
    BEGIN CATCH
    THROW 50001, 'Error occured when creating post table', 1 ;
    END CATCH`

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("Table created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};


///followTable
const createFollowTable = async () => {
  try {
    const table = `
    CREATE TABLE Follow (
      followId VARCHAR(200) PRIMARY KEY,
      followerId VARCHAR(200) ,
      followingId VARCHAR(200) ,
      CONSTRAINT fk_follower FOREIGN KEY (followerId) REFERENCES userTable(id),
      CONSTRAINT fk_following FOREIGN KEY (followingId) REFERENCES userTable(id),
  );
  `

    const pool = await mssql.connect(sqlConfig);

    await pool.request().query(table, (err) => {
      if (err instanceof mssql.RequestError) {
        console.log(err.message);
      } else {
        console.log("Table created Successfully");
      }
    });
  } catch (error) {
    return { Error: error };
  }
};

const createLikesTable = async () => {
  try{
    const table = `CREATE TABLE likes (
      likeId VARCHAR(200) PRIMARY KEY,
      postId VARCHAR(200) ,
      userId VARCHAR(200) ,
      likedDate DATETIME,
      CONSTRAINT FK_Likes_Post FOREIGN KEY (postId) REFERENCES posts(postId),
      CONSTRAINT FK_Likes_User FOREIGN KEY (userId) REFERENCES userTable(id)
  );`

  const pool = await mssql.connect(sqlConfig)

  await pool.request().query(table, (err) =>{
    if (err instanceof mssql.RequestError){
      console.log(err.message);
    }else{
      console.log("Table created successfully");
    }
  })
  } catch (error) {
    return { Error: error };
  }
}

///Create subComments Table
const createSubCommentsTable = async () => {
  try{
    const table = `CREATE TABLE subComments (
      subcommentId VARCHAR(200) PRIMARY KEY,
      commentId VARCHAR(200),    -- Reference to the post the comment belongs to
      userId VARCHAR(200),    -- Reference to the user who made the comment
      subCommentText VARCHAR(200),
      createdAt DATETIME,
      FOREIGN KEY (commentId) REFERENCES comments(commentId),
      FOREIGN KEY (userId) REFERENCES userTable(id)
  );`

  const pool = await mssql.connect(sqlConfig)

  await pool.request().query(table, (err) =>{
    if (err instanceof mssql.RequestError){
      console.log(err.message);
    }else{
      console.log("Table created successfully");
    }
  })
  } catch (error) {
    return { Error: error };
  }
}

module.exports = {
    createUsersTable,
    createPostsTable,
    createCommentsTable,
    createFollowTable,
    createLikesTable,
    createSubCommentsTable
}

CREATE TABLE likes (
    likeId VARCHAR(200) PRIMARY KEY,
    postId VARCHAR(200) ,
    userId VARCHAR(200) ,
    likedDate DATETIME,
    CONSTRAINT FK_Likes_Post FOREIGN KEY (postId) REFERENCES posts(postId),
    CONSTRAINT FK_Likes_User FOREIGN KEY (userId) REFERENCES userTable(id)
);

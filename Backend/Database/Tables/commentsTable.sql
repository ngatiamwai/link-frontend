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
END CATCH

SELECT * FROM comments

DELETE FROM comments
WHERE commentId = '9faa8556-be3f-4ed6-bff6-d15193f7d6c8';

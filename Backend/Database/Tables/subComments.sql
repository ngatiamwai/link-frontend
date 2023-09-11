-- BEGIN TRY
CREATE TABLE subComments (
    subcommentId VARCHAR(200) PRIMARY KEY,
    commentId VARCHAR(200),    -- Reference to the post the comment belongs to
    userId VARCHAR(200),    -- Reference to the user who made the comment
    subCommentText VARCHAR(200),
    createdAt DATETIME,
    FOREIGN KEY (commentId) REFERENCES comments(commentId),
    FOREIGN KEY (userId) REFERENCES userTable(id)
);
-- END TRY
-- BEGIN CATCH
-- THROW 50001, 'Error occured when creating subComments table', 1 ;
-- END CATCH

SELECT * FROM subComments

DROP TABLE subComments
CREATE OR ALTER PROCEDURE createComment
    @commentId VARCHAR (200),
    @commentText VARCHAR(200),
    @commentPic VARCHAR(200),
    @userId VARCHAR(200),
    @postId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        INSERT INTO comments (commentId, commentText, commentPic, userId, postId)
        VALUES (@commentId, @commentText, @commentPic, @userId, @postId);
    END TRY
    BEGIN CATCH
        THROW 50001, 'Error occurred when creating a comment', 1;
    END CATCH
END;

DROP PROCEDURE createComment
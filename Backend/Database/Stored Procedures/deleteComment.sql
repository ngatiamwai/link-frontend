CREATE OR ALTER PROCEDURE DeleteComment
    @commentId VARCHAR(200),
    @postId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        -- Delete the comment
        DELETE FROM comments
        WHERE commentId = @commentId;

        -- Decrement the numComments column in the posts table
        UPDATE posts
        SET numComments = numComments - 1
        WHERE postId = @postId;
    END TRY
    BEGIN CATCH
        THROW 50001, 'Error occurred when deleting a comment', 1;
    END CATCH
END;

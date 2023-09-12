CREATE OR ALTER PROCEDURE UnlikePost
    @postId VARCHAR(200),
    @userId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        -- Delete the like
        DELETE FROM likes
        WHERE postId = @postId AND userId = @userId;

        -- Decrement the numLikes column in the posts table
        UPDATE posts
        SET numLikes = numLikes - 1
        WHERE postId = @postId;
    END TRY
    BEGIN CATCH
        THROW 50001, 'Error occurred when unliking a post', 1;
    END CATCH
END;

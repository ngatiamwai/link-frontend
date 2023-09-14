CREATE OR ALTER PROCEDURE DeletePostAndLikes
@postId VARCHAR(200),
@userId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        -- Delete likes associated with the post
        DELETE FROM likes WHERE postId = @postId;

    -- Delete comments associated with the post
        DELETE FROM comments WHERE postId = @postId

        -- Delete the post itself
        DELETE FROM posts WHERE postId = @postId;

        -- Return a success message if needed
        SELECT 'Post and associated likes deleted successfully' AS Message;
    END TRY
    BEGIN CATCH
        -- Handle any errors and return an error message
        THROW 50003, 'Error occurred when deleting post and associated likes', 1;
    END CATCH
END;

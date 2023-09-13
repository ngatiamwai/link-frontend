CREATE OR ALTER PROCEDURE updatePost
    @postId VARCHAR(200),
    @postName VARCHAR(200) = NULL,
    @postPic VARCHAR(200) = NULL
AS
BEGIN
    BEGIN TRY
        -- Update the post based on postId
        UPDATE posts
        SET 
            postName = ISNULL(@postName, postName), -- Update postName if provided, otherwise keep the existing value
            postPic = ISNULL(@postPic, postPic), -- Update postPic if provided, otherwise keep the existing value
            updated_at = GETDATE()
        WHERE postId = @postId;

        SELECT 'Post updated successfully' AS message;
    END TRY
    BEGIN CATCH
        THROW 50001, 'Error occurred when updating the post', 1;
    END CATCH
END;

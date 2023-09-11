CREATE PROCEDURE UploadPostProc
    @postId VARCHAR(200),
    @postName VARCHAR(200),
    @postPic VARCHAR(200),
    @userId VARCHAR(200),
    @updated_at DATETIME
AS
BEGIN
    BEGIN TRY
        -- Insert a new post into the "posts" table
        INSERT INTO posts (postId, postName, postPic, userId, updated_at)
        VALUES (@postId, @postName, @postPic, @userId, @updated_at);

        -- Return a success message
        SELECT 'Post uploaded successfully' AS message;
    END TRY
    BEGIN CATCH
        -- Handle errors by throwing an error message
        THROW 50001, 'An error occurred while uploading the post.', 1;
    END CATCH;
END;
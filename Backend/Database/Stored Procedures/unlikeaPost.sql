CREATE PROCEDURE UnlikePost
    @postId VARCHAR(200),
    @userId VARCHAR(200)
AS
BEGIN
    -- Check if the user has liked the post
    IF EXISTS (SELECT 1 FROM likes WHERE postId = @postId AND userId = @userId)
    BEGIN
        -- User has liked the post, delete the like
        DELETE FROM likes WHERE postId = @postId AND userId = @userId;
    END
END

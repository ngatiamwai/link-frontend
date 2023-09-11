CREATE PROCEDURE LikePost
    @likeId VARCHAR(200),
    @postId VARCHAR(200),
    @userId VARCHAR(200),
    @likedDate DATETIME
AS
BEGIN
    -- Check if the user has already liked the post
    IF NOT EXISTS (SELECT 1 FROM likes WHERE postId = @postId AND userId = @userId)
    BEGIN
        -- User has not liked the post, insert a new like
        INSERT INTO likes (likeId, postId, userId, likedDate)
        VALUES (NEWID(), @postId, @userId, GETDATE());
    END
END

DROP PROC LikePost
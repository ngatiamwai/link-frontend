CREATE OR ALTER PROCEDURE LikePost
    @likeId VARCHAR(200),
    @postId VARCHAR(200),
    @userId VARCHAR(200)
AS
BEGIN
    -- Check if the user has already liked the post
    IF NOT EXISTS (SELECT 1 FROM likes WHERE postId = @postId AND userId = @userId)
    BEGIN
        -- User has not liked the post, insert a new like
        INSERT INTO likes (likeId, postId, userId)
        VALUES (@likeId, @postId, @userId);

        -- Increment the numLikes column in the posts table
        UPDATE posts
        SET numLikes = numLikes + 1
        WHERE postId = @postId;
    END
END;


DROP PROC LikePost
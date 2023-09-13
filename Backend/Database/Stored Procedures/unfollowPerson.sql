CREATE OR ALTER PROCEDURE unfollowPerson
    @followerId VARCHAR(200),
    @followingId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        DELETE FROM Follow
        WHERE followerId = @followerId AND followingId = @followingId;

        -- Decrease the numFollowers count for the user being unfollowed
        UPDATE userTable
        SET numFollowers = CASE WHEN numFollowers > 0 THEN numFollowers - 1 ELSE 0 END
        WHERE id = @followingId;

        -- Decrease the numFollowing count for the follower
        UPDATE userTable
        SET numFollowing = CASE WHEN numFollowing > 0 THEN numFollowing - 1 ELSE 0 END
        WHERE id = @followerId;

        -- Return a success message
        SELECT 'Unfollowed successfully' AS message;
    END TRY
    BEGIN CATCH
        -- Handle errors by throwing an error message
        THROW 50001, 'An error occurred while unfollowing the user.', 1;
    END CATCH;
END;

-- DROP PROC unfollowPerson
USE Link
GO

CREATE OR ALTER PROCEDURE followPerson
    @followId VARCHAR(200),
    @followerId VARCHAR(200),
    @followingId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        INSERT INTO Follow (followId, followerId, followingId)
        VALUES (@followId, @followerId, @followingId);

        -- Increase the numFollowers count for the user being followed
        UPDATE userTable
        SET numFollowers = numFollowers + 1
        WHERE id = @followingId;

        -- Increase the numFollowing count for the follower
        UPDATE userTable
        SET numFollowing = numFollowing + 1
        WHERE id = @followerId;

        -- Return a success message
        SELECT 'Followed successfully' AS message;
    END TRY
    BEGIN CATCH
        -- Handle errors by throwing an error message
        THROW 50001, 'An error occurred while following the user.', 1;
    END CATCH;
END;


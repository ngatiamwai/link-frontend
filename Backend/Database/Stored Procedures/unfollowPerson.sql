CREATE PROCEDURE unfollowPerson
    @followerId VARCHAR(200),
    @followingId VARCHAR(200)
AS
BEGIN
    DELETE FROM Follow
    WHERE followerId = @followerId AND followingId = @followingId;
END

DROP PROC unfollowPerson
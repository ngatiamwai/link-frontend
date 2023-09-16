CREATE OR ALTER PROCEDURE yourFollowers
    @followerId VARCHAR(200)
AS
BEGIN
    SELECT F.followingId, U.name, U.username, U.profilePic
    FROM Follow F
    INNER JOIN userTable U ON F.followingId = U.id
    WHERE F.followingId = @followerId;
END


-- DROP PROC GetPeopleYouAreFollowing
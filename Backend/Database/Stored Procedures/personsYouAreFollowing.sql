CREATE PROCEDURE personsYouAreFollowing
    @userId VARCHAR(200)
AS
BEGIN
    SELECT U.* 
    FROM userTable U
    JOIN Follow F ON U.id = F.followingId
    WHERE F.followerId = @userId;
END

DROP PROC personsYouAreFollowing
CREATE PROCEDURE getPersonsToFollow
    @currentUserId VARCHAR(200)
AS
BEGIN
    SELECT * FROM userTable
    WHERE id NOT IN (
        SELECT followingId FROM Follow
        WHERE followerId = @currentUserId
    );
END

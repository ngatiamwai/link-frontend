USE Link
GO

CREATE OR ALTER PROCEDURE followPerson
    @followId VARCHAR(200),
    @followerId VARCHAR(200),
    @followingId VARCHAR(200)
AS
BEGIN
    INSERT INTO Follow (followId, followerId, followingId)
    VALUES (@followId, @followerId, @followingId);
END
GO

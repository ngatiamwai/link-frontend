CREATE OR ALTER PROCEDURE getLikedPostsByUser
    @userId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        -- Select posts liked by the specified user
        SELECT p.*
        FROM posts AS p
        INNER JOIN likes AS l ON p.postId = l.postId
        WHERE l.userId = @userId;
    END TRY
    BEGIN CATCH
        THROW 50001, 'Error occurred when fetching liked posts', 1;
    END CATCH
END;

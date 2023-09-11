CREATE OR ALTER PROCEDURE GetPostsByUserId
    @userId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        SELECT *
        FROM posts
        WHERE userId = @userId;
    END TRY
    BEGIN CATCH
        THROW 50002, 'Error occurred when retrieving user posts', 1;
    END CATCH
END;

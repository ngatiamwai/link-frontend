CREATE OR ALTER PROCEDURE UploadPostProc
    @postId VARCHAR(200),
    @postName VARCHAR(200),
    @postPic VARCHAR(200),
    @userId VARCHAR(200)
AS
BEGIN
    BEGIN TRY
        INSERT INTO posts (postId, postName, postPic, updated_at, userId)
        VALUES (@postId, @postName, @postPic, GETDATE(), @userId);
    END TRY
    BEGIN CATCH
        THROW 50001, 'Error occurred when creating a post', 1;
    END CATCH
END;

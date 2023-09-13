CREATE OR ALTER PROCEDURE UpdateComment
    @commentId VARCHAR(200),
    @commentText VARCHAR(200) = NULL,  -- Allow commentText to be NULL (no change)
    @commentPic VARCHAR(200) = NULL    -- Allow commentPic to be NULL (no change)
AS
BEGIN
    BEGIN TRY
        DECLARE @sql NVARCHAR(MAX) = N'';

        -- Construct the dynamic SQL statement
        SET @sql = N'UPDATE comments SET ';

        IF @commentText IS NOT NULL
        BEGIN
            SET @sql = @sql + N'commentText = @commentText, ';
        END

        IF @commentPic IS NOT NULL
        BEGIN
            SET @sql = @sql + N'commentPic = @commentPic, ';
        END

        -- Remove the trailing comma and space
        SET @sql = LEFT(@sql, LEN(@sql) - 1);

        -- Add the WHERE clause
        SET @sql = @sql + N' WHERE commentId = @commentId';

        -- Execute the dynamic SQL
        EXEC sp_executesql @sql, N'@commentId VARCHAR(200), @commentText VARCHAR(200), @commentPic VARCHAR(200)', @commentId, @commentText, @commentPic;

        -- Return a success message
        SELECT 'Comment updated successfully' AS message;
    END TRY
    BEGIN CATCH
        -- Handle errors by throwing an error message
        THROW 50001, 'An error occurred while updating the comment.', 1;
    END CATCH
END;

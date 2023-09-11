CREATE OR ALTER PROCEDURE insertSubComment
    @subcommentId VARCHAR(200),
    @commentId VARCHAR(200),
    @userId VARCHAR(200),
    @subCommentText VARCHAR(200),
    @createdAt DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        -- Insert the subcomment into the subComments table
        INSERT INTO subComments (subcommentId, commentId, userId, subCommentText, createdAt)
        VALUES (@subcommentId, @commentId, @userId, @subCommentText, @createdAt)

        -- Return a success message
        -- SELECT 'Sub-comment inserted successfully' AS Message
    END TRY
    BEGIN CATCH
        -- Return an error message
        SELECT ERROR_MESSAGE() AS ErrorMessage
    END CATCH
END


DROP PROC insertSubComment

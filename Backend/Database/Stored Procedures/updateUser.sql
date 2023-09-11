CREATE OR ALTER PROCEDURE updateUserProc (
    @id VARCHAR(200),
    @name VARCHAR(200), 
    @username VARCHAR(50),
    @email VARCHAR(100),
    @phone_number INT,
    @profilePic VARCHAR(200)
)
AS
BEGIN
    BEGIN TRY
        -- Update user details
        UPDATE userTable
        SET
            name = @name,
            username = @username,
            email = @email,
            phone_number = @phone_number,
            updated_at = GETDATE(),
            profilePic = @profilePic
        WHERE id = @id;
    END TRY
    BEGIN CATCH
        THROW;
    END CATCH;
END;

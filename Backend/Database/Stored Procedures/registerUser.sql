CREATE OR ALTER PROCEDURE registerUserProc
    @id VARCHAR(200),
    @name VARCHAR(200),
    @username VARCHAR(50),
    @email VARCHAR(100),
    @password VARCHAR(255),
    @phone_number VARCHAR(20)
AS
BEGIN
    INSERT INTO userTable (id, name, username, email, password, phone_number)
    VALUES (@id, @name, @username, @email, @password, @phone_number);

    -- Set the default profile picture for the newly registered user
    DECLARE @defaultProfilePic VARCHAR(255);
    SET @defaultProfilePic = '/Frontend/Images/user_2143330.png'; -- Change this to the actual default image URL or filename

    UPDATE userTable
    SET profilePic = @defaultProfilePic
    WHERE id = @id;
END;


-- Update profile pictures that are NULL to the default picture
UPDATE userTable
SET profilePic = '/Frontend/Images/user_2143330.png'
WHERE profilePic IS NULL;



SELECT * FROM userTable;

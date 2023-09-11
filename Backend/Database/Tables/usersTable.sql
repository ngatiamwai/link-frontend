BEGIN TRY
CREATE TABLE userTable(
        id VARCHAR(200) PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,   
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user', 
        phone_number INT,
        updated_at DATETIME,
        resetToken VARCHAR(200),
        resetTokenExpiry DATETIME, 
    );
END TRY
BEGIN CATCH
    THROW 50001, 'Table already exists!', 1;
END CATCH;

ALTER TABLE userTable
ADD profilePic VARCHAR(255) -- You can adjust the data type and size as needed



DROP TABLE userTable

SELECT * FROM userTable
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
END;




SELECT * FROM userTable;

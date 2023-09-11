CREATE OR ALTER PROCEDURE userLoginProc(@email VARCHAR(200))
AS
BEGIN
    SELECT * FROM userTable WHERE email = @email
END
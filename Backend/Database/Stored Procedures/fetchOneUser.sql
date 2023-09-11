CREATE OR ALTER PROCEDURE fetchOneUser (@id VARCHAR(200))
AS  
    BEGIN 
        SELECT * FROM userTable  WHERE id = @id
    END
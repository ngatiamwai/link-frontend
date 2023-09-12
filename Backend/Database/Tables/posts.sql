BEGIN 
TRY
CREATE TABLE posts(
    postId VARCHAR(200) PRIMARY KEY,
    postName VARCHAR(200) NOT NULL,
    postPic VARCHAR (200),
    updated_at DATETIME,
    userId VARCHAR(200),
    FOREIGN KEY (userId) REFERENCES userTable(id) ON UPDATE CASCADE ON DELETE CASCADE,
    -- FOREIGN KEY (name, username) REFERENCES userTable(name, username) ON UPDATE CASCADE ON DELETE CASCADE
);
END TRY
BEGIN CATCH
THROW 50001, 'Error occured when creating post table', 1 ;
END CATCH


SELECT * FROM posts

BEGIN TRY
ALTER TABLE posts
ADD numComments INT DEFAULT 0, -- Default value is 0
    numLikes INT DEFAULT 0;     -- Default value is 0
END TRY
BEGIN CATCH
THROW 50002, 'Error occurred when altering posts table', 1;
END CATCH

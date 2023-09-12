CREATE OR ALTER PROCEDURE fetchAllPosts
AS
BEGIN
    SELECT * FROM posts
    ORDER BY updated_at DESC; -- This will order the posts by the date uploaded in descending order (latest first)
END;

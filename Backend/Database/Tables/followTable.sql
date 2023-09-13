CREATE TABLE Follow (
    followId VARCHAR(200) PRIMARY KEY,
    followerId VARCHAR(200) ,
    followingId VARCHAR(200) ,
    CONSTRAINT fk_follower FOREIGN KEY (followerId) REFERENCES userTable(id),
    CONSTRAINT fk_following FOREIGN KEY (followingId) REFERENCES userTable(id),
);


SELECT * FROM Follow
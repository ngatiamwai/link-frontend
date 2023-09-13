const mssql = require('mssql')
const { v4 } = require('uuid')
const dotenv = require('dotenv')
const { sqlConfig } = require('../Config/config')

dotenv.config()

const followPerson = async (req, res) => {
  try {
      const followId = v4();
      const { followerId, followingId } = req.params;

      console.log(followerId, followingId);

      if (!followerId || !followingId) {
          return res.status(400).json({
              error: 'Please provide followerId and followingId.',
          });
      }

      const pool = await mssql.connect(sqlConfig)

          const result = await pool.request()
              .input("followId", followId)
              .input("followingId", followingId)
              .input("followerId", followerId)
              .execute("followPerson");

          if (result.rowsAffected[0] == 1) {
              res.status(200).json({ message: 'You are now following this user.' });
          } else {
              return res.status(400).json({ message: "Following user failed" });
          }

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while following the user.' });
  }
};



const unfollowPerson = async (req, res) => {
    try {
        const { followerId, followingId } = req.params;

        if (!followerId || !followingId) {
            return res.status(400).json({
                error: 'Please provide followerId, and followingId.',
            });
        }

        const pool = await mssql.connect(sqlConfig);
        const result = await pool.request()
            .input("followerId", followerId)
            .input("followingId", followingId)
            .execute("unfollowPerson");

        if (result.rowsAffected[0] == 1) {
            res.status(200).json({ message: 'You have successfully unfollowed this user.' });
        } else {
            return res.status(400).json({ message: "Unfollowing user failed. Because you are not following them." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while unfollowing the user.' });
    }
};


///Persons to follow
const getPersonsToFollow = async (req, res) => {
    try {
      const { currentUserId } = req.params;
  
      if (!currentUserId) {
        return res.status(400).json({
          error: 'Please provide currentUserId.',
        });
      }
  
      const pool = await mssql.connect(sqlConfig);
      const result = await pool
        .request()
        .input('currentUserId', currentUserId)
        .execute('getPersonsToFollow');
  
      // The result contains the list of users to follow
      const usersToFollow = result.recordset;
  
      res.status(200).json(usersToFollow);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching users to follow.' });
    }
  };
  


  ///persons you are followning
  const getPersonsYouAreFollowing = async (req, res) => {
    try {
      const { userId } = req.params;
  
      if (!userId) {
        return res.status(400).json({
          error: 'Please provide userId.',
        });
      }
  
      const pool = await mssql.connect(sqlConfig);
      const result = await pool
        .request()
        .input('userId', userId)
        .execute('personsYouAreFollowing');
  
      // The result contains the list of persons you are following
      const personsYouAreFollowing = result.recordset;
  
      res.status(200).json(personsYouAreFollowing);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching persons you are following.' });
    }
  };



 ///Your Followers
const yourFollowers = async (req, res) => {
  try {
    const { followerId } = req.params;

    if (!followerId) {
      return res.status(400).json({
        error: 'Please provide followerId.',
      });
    }

    console.log(followerId);

    const pool = await mssql.connect(sqlConfig);

    // Execute the stored procedure with the correct parameter name
    const result = await pool
      .request()
      .input('followerId', followerId) // Use followerId instead of userId
      .execute('yourFollowers');

    // Send the list of followers as a JSON response
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while getting your followers.' });
  }
};


module.exports = {
    followPerson,
    unfollowPerson,
    getPersonsToFollow,
    getPersonsYouAreFollowing,
    yourFollowers
}
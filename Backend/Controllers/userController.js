const mssql = require('mssql');
const { sqlConfig } = require('../Config/config');

const updateUser = async (req, res) => {
    try {
        const { id } = req.params; // User ID to be updated
        const { name, username, email, phone_number, profilePic } = req.body;

        const pool = await mssql.connect(sqlConfig);

        const result = await pool.request()
            .input('id', mssql.VarChar, id)
            .input('name', mssql.VarChar, name)
            .input('username', mssql.VarChar, username)
            .input('email', mssql.VarChar, email)
            .input('phone_number', mssql.VarChar, phone_number)
            .input('profilePic', mssql.VarChar, profilePic)
            .execute('updateUserProc');

        if (result.rowsAffected[0] > 0) {
            return res.status(200).json({ message: 'Your details were updated successfully' });
        } else {
            return res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const oneUser = async (req, res) => {
    try {
      const { id } = req.params; // User ID
  
      const pool = await mssql.connect(sqlConfig);
  
      // Fetch User by its ID from the Users table
      const user = (
        await pool
          .request()
          .input("id", id)
          .execute("fetchOneUser")
      ).recordset[0];
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      return res.json({
        user,
      });
    } catch (error) {
      return res.json({ error });
    }
  };


module.exports = {
    updateUser,
    oneUser
}

const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const verifyToken = async (req, res, next)=>{
    console.log(req.headers);
    try {
        const token = req.headers['token']
        if(!token){
            return res.status(403).json({message: "Restricted access, please provide a token"})
        }
        const decodedData = jwt.verify(token, process.env.SECRET)
        req.info = decodedData
        
    } catch (error) {
        console.log(error.message);
        return res.status(401).json({message: error.message})
    }
    next()
}

module.exports ={
    verifyToken
}

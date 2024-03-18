// authenticationMiddleware.js

const jwt = require('jsonwebtoken');
const UserTable = require('../Models/UserData');
const secretyKey = "abcdefghijklmnopqrstuvwxyzabcdef";
const salt = "humaira";

module.exports.authenticateUser = async function(req, res, next) {
    try {
        // Extract the authentication token from the request headers
        const authToken = req.headers.authorization;
        // console.log("authToken in authentication at 000  humaira",authToken)

        // Verify the authentication token
        if (!authToken) {
            return res.status(401).json({ message: 'Unauthorized. Missing authentication token.' });
        }

        // Verify the token
        const decodedToken = jwt.verify(authToken, `${secretyKey}-${salt}`);

        // console.log("DEcoded  token ",decodedToken )
        // Find the user based on the user ID from the decoded token]
        // console.log("decode ka username " ,decodedToken.userName);
        const user = await UserTable.find({userName:decodedToken.userName});
        
// console.log(user);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized. User not found.' });
        }

        // Attach the authenticated user information to the request object
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized. Invalid authentication token.' });
    }
};


module.exports.validateUser = async (req,res,next) => {
    try{
        const salt = "Humaira";
        const token = req.headers.authorization;
        const verifyToken = jwt.verify(token,secretyKey,salt);
        console.log(token);
    }catch(err){
        conole.log(err);
    }
}
const userController = require('../../Controller/UserController');
const userSchema = require('../../Schemas/UserSchema');
const universalFunction=require('../../Functions/universalFunction');
const validationFunction = require("../../Functions/validationFunction");
const Router = require("express").Router();
const authnticateUser = require("../../Functions/AuthnticateUser")
Router.route('/signup').post(
    validationFunction.validateUser(userSchema.userLoginSchema),
    userController.signupUser
 );


Router.route('/login').post(
    validationFunction.validateUser(userSchema.userLoginSchema),
    userController.loginUser
);

Router.route('/add/:id').put(
    universalFunction.authenticateUser,
   //validationFunction.validateUser(userSchema.userCreateSchema),
   userController.updatePhoneNumber
);

Router.route('/update/:id').put(
    universalFunction.authenticateUser,
   //validationFunction.validateUser(userSchema.userCreateSchema),
   userController.updateUserDetails
);

// Router.route('/getAllUserDetails').get(
//     universalFunction.authenticateUser,
//    // validationFunction.validateUser(userSchema.getAllUserSchemas),
//     userController.getAllUserList
// );

Router.get("/getAllUserDetails",authnticateUser.authenticateUser,(req,res) =>{
const authenticatedUserId = req.user._id;
res.json({ message: 'You are authenticated!', userId: authenticatedUserId });
}
)


Router.route('/getOneUserDetails/:id').get(

    //validationFunction.validateUser(userSchema.updateUserSchemas),
    authnticateUser.authenticateUser,
    // if(req.user)
    userController.getOneUserDetails 
);

// Router.get("/getOneUserDetails",authnticateUser.authenticateUser,(req,res) =>{
//     userController.getOneUserDetails
//     const authenticatedUserId = req.user._id;
// res.json({ message: 'You are authenticated!', userId: authenticatedUserId });
// })
// 
Router.route('/deleteUserDetails/:id').delete(
    universalFunction.authenticateUser,
    //validationFunction.validateUser(userSchema.updateUserSchemas),
    userController.deleteUser
);


exports.Router=Router;

















const userController = require('../../Controller/UserTableController');
const userSchema = require('../../Schemas/UserSchema');
// const universalFunction=require('../../Functions/universalFunction');
// const validationFunction = require("../../Functions/validationFunction");
const Router = require("express").Router();
const userControllerControl = require('../../Controller/UserController');
// const userSchema = require('../../Schemas/UserSchema');
const universalFunction=require('../../Functions/universalFunction');
const validationFunction = require("../../Functions/validationFunction");
const authnticateUser = require("../../Functions/AuthnticateUser")
const {validateUser} = require("../../Functions/AuthnticateUser")
// Create a separate collection for storing deleted IDs
// const DvalidateUsereletedIds = mongoose.model('DeletedIds', new mongoose.Schema({
//     id: { type: Number, required: true }
//   }));
const userTable = require("../../Models/UserData");

//[search by userName,displayName,id]

Router.get("/search",
universalFunction.authenticateUser,
userController.Search
);

Router.get("/columnSearch",
userController.columnSearch
);

Router.get("/searchById",
userController.SearchById
);

Router.get("/export",
userController.exportToExcel
)

Router.get("/searchByDisplayName",
userController.SearchByDisplayName
);

Router.get("/searchByUserName",
userController.SearchByUserName
);

Router.post('/login',
    // validationFunction.validateUser(userSchema.userLoginSchema),
    userControllerControl.loginUser
 );

 Router.post("/logout",authnticateUser.validateUser,async(req,res) =>{
    console.log("req.user",req.user[0]);
    req.user[0].authToken="";
    await req.user[0].save();
 });

Router.route('/save').post(
    validationFunction.validateUser(userSchema.saveUserDataSchema),
    userController.saveUserData
 );

Router.route('/getAllUserData').get(

    // universalFunction.authenticateUser,
    // authnticateUser.authenticateUser,
      userController.getAllUserDataList
);

Router.route('/getAllUserDataSearch').get(
    universalFunction.authenticateUser,
      userController.getAllUserDataSearch
);

Router.route("/getOne/:userId").get(
    universalFunction.authenticateUser,
    userController.getOneData
)

Router.route('/updateUserDetails/:userId').patch(
    universalFunction.authenticateUser,
   userController.updateUserDetails
);

Router.route('/updateUserPassword/:userId').patch(
    universalFunction.authenticateUser,
   userController.updateUserPassword
);


Router.route('/deleteUserDetails/:id').delete(
    universalFunction.authenticateUser,
    userController.deleteUser
);


exports.Router=Router;

















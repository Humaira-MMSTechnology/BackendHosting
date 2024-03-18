const UserDetails = require("../Models/UserDetails");
const universalFunction = require('../Functions/universalFunction');
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const secretyKey = "abcdefghijklmnopqrstuvwxyzabcdef";
const userTable = require("../Models/UserData");


exports.signupUser = (async (request, response, next) => {
    try {
        
        const {
            userName,
            email,
            mpin,
            phoneNumber
           
        } = request.body;
        
        const userData = await UserDetails.find({ email:email }).countDocuments();
        if (userData > 0) {
            return response.status(409).send({
                status: "FAILURE",
                message: "User  already exist"
            })
        }
                                  
      
        const userDetailsCheck = new UserDetails();
        userDetailsCheck.userName = userName;
        userDetailsCheck.email = email;
       userDetailsCheck.password = mpin;
       userDetailsCheck.phoneNumber='';
        
        console.log("userDetails", userDetailsCheck);
       
        const userdetails = userDetailsCheck.save(async function (error, saveResult) {
            if (error) { throw new Error(error); }
  
            
            let responseData = {
                status: "SUCCESS",
                message: "User signup successfully",
                data: []
                            
            }; universalFunction.sendResponse(request, response, responseData, next);
            }
   
        );
        
        
    } catch (error) {
        console.log(error);
        next(error);
        
       
    }

});

// exports.loginUser= async function (request, response, next) {
//     // try {
//     //     const { userName,mpin  } = request.body;
//     //     const userData = await userTable.find({userName:userName})

//         // if (userData.length==0) {
//         //     return response.status(400).send({
//         //         status: "FAILURE",
//         //         message: " Invalid data "
//         //     })
//         // }
    
//         // if (!userData[0].authenticate(mpin)) {
//         //     let responseData = {
//         //         status: "FAILURE",
//         //         message: "Invalid Mpin",
//         //         data: { verified: false }
//         //     };
//         //     universalFunction.sendResponse(request,response, responseData, next);
//     //     } else {
//     //         const salt = "humaira";
//     //         userData[0].authToken = salt;

//             // userData[0].save(async (error, result) => {
//             //     if (error) {
//             //         throw new Error(error);
//             //     }
//             //     var jsonPayload = {
//             //         userName: userName,
//             //         // email: email,
//             //         mpin:mpin,
//             //         userId : userData._id

                    
//             //     };
//             //     const jwtData = jwt.sign(jsonPayload, `${secretyKey}-${salt}`, {
//             //         expiresIn: "1d",
//             //     });
                
//             //    console.log("jwtData/authToken when loggin in : ",jwtData)

//             //     let responseData = {
//             //         status: "SUCCESS",
//             //         message: "Login successfully",
//             //         data: {
//             //             verified: "true",
//             //             _id: userData[0]._id ,
//             //             id:userData[0].id,
//             //             userName:userName,
//             //             displayName:userData[0].displayName,
//             //             // email:email,
//             //             authToken: jwtData,
//             //         },
//             //     };
//         //         universalFunction.sendResponse(request, response, responseData, next);
           
//         //     })
//         // }

//     // } catch (error) {
//     //     console.log(error);
//     //     next(error);

//     // }

//     const {userName , mpin } = request.body;

//    try{
//     const user = await userTable.findOne({ userName });

//     if (!user) {
//         return response.status(400).json({statusCode:400, message: "User not found" });
//       }

//         // Authenticate user with provided password
//     if (!user.authenticate(mpin)) {
//         return response.status(400).json({statusCode:400, message: "Invalid credentials"  });
//       }
 
//     const salt = "Humaira";
//     // user.save(async (error,result) =>{
//     //      if (error){
//     //         throw new Error(error)
//     //      }else{
//     //         var jsonPayload = {
//     //                     userName: userName,
//     //                     // mpin:mpin,
//     //                     userId : user._id
//     //     };

//         const jwtData = jwt.sign({userName , userId : user._id}, `${secretyKey}-${salt}`, {
//             expiresIn: "1d",
//         });

//          user.authToken = jwtData;
//          await user.save();
//         console.log(user);

//         console.log(jwtData);
//         console.log(user.authToken)
         
//     // consle.log(token);

//       return response.status(200).json({ statusCode:200, message: "Login successful" , user });  
//    } catch (error) {
//     console.error("Login Error:", error);
//     return response.status(500).json({ statusCode:400 , message: "Internal Server Error" , error});
//   }



// };


exports.loginUser= async function (request, response, next) {
    try {
        const { userName,mpin} = request.body;
        const userData = await userTable.find({userName:userName,mpin:mpin});

        if (userData.length === 0) {
            return response.status(400).send({
                status: "FAILURE",
                message: " Invalid userName "
            })
        }
        
        if (!userData[0].authenticate(mpin)) {
            let responseData = {
                status: "FAILURE",
                message: "Invalid Mpin password",
                data: { verified: false }
            };
            universalFunction.sendResponse(request,response, responseData, next);
        } else {
            const salt = "Humaira"
            // userData[0].authToken = salt;

            var jsonPayload = {
                userName:userName,
                 mpin:mpin
                 
             };
             const jwtData = jwt.sign(jsonPayload,secretyKey, {
                 expiresIn: "1d",
             });

             console.log(jwtData);

             
        // Update user's authToken field and save to database
        userData[0].authToken = jwtData;
        await userData[0].save();

        let responseData = {
            status: "SUCCESS",
            message: "Login successfully",
            data: {
                verified: true,
                userName: userName,
                authToken: jwtData,
            },
        };
        universalFunction.sendResponse(request, response, responseData, next);
        }

    } catch (error) {
        next(error);
    }

};



exports.updatePhoneNumber = async function (request, response, next) {
    try {
        const id = request.params.id;
        const { phoneNumber } = request.body;

        const updatedUser = await UserDetails.findOneAndUpdate(
            { _id: id },
            { $set: { phoneNumber: phoneNumber } },
            { new: true }
        );

        if (!updatedUser) {
            return response.status(404).send({
                status: "FAILURE",
                message: "User not found"
            });
        }

        let responseData = {
            status: "SUCCESS",
            message: "Phone number added successfully",
            data: updatedUser
        };

        universalFunction.sendResponse(request, response, responseData, next);

    } catch (error) {
        console.log(error);
        next(error);
    }
};


  exports.getAllUserList = async function (request, response, next) {
    try {
        var userDetailsList = await UserDetails.find();

        if (userDetailsList.length === 0) {
            return response.status(400).send({
                status: "FAILURE",
                message: "User data not found"
            });
        }

        let responseData = {
            status: "SUCCESS",
            message: "List of all user",
            data: {
                userDetailsList: userDetailsList,
                count: userDetailsList.length,
            },
        };

        responseData.data.userDetailsList = userDetailsList;

        universalFunction.sendResponse(request, response, responseData, next);

    } catch (error) {
        next(error);
    }
};

  exports.getOneUserDetails=async function (request,response,next){
    try{
        // if(!request.user){
        //     return response.status(401).json({
        //         status: "FAILURE",
        //         message: "Unauthorized access"
        //     });
        // }

        if(!request.user) {
            return response.status(401).json({
                status: "FAILURE",
                message: "Unauthorized access"
            });
        }

        console.log("get one details executed");
         const userId=request.params.id;   
      
         const userDetails= await userTable.findById(userId);
           
        if (!userDetails)
       {
        return response.status(404).send({
            status:"FAILURE",
            message:" User data not  found"
        }); 
        }
        console.log("User...data", userDetails);
       let responseData={
        status:"SUCCESS",
        message:"Get one user details",
        data:userDetails
     }
     universalFunction.sendResponse(request,response,responseData,next);

    }catch(error){
        next(error);
    }
  };
  
 
exports.updateUserDetails = async function (request, response, next) {
    try {
        const id = request.params.id;
        const { phoneNumber,email,userName } = request.body;

        const updatedUser = await UserDetails.findOneAndUpdate(
            { _id: id },
            { $set: { phoneNumber: phoneNumber ,email:email,userName:userName} },
            { new: true } 
        );

        if (!updatedUser) {
            return response.status(404).send({
                status: "FAILURE",
                message: "User not found"
            });
        }

        let responseData = {
            status: "SUCCESS",
            message: "User data updated successfully",
            data: updatedUser
        };

        universalFunction.sendResponse(request, response, responseData, next);

    } catch (error) {
        console.log(error);
        next(error);
    }
};

  exports.deleteUser=async function(request,response,next){
    try{
      const userId=request.params.id;
                
       const userDetails=await UserDetails.findByIdAndDelete(userId);
        console.log(userDetails);   

         if(!userDetails){
        return response.status(400).send({
            status:"FAILURE",
            message:" User data not  found"
        }); 
        }

        let responseData = {
            status:"SUCCESS",
            message:"Delete user details successfully",
            data:[]
        }
        universalFunction.sendResponse(request,response,responseData,next);
  
    }catch(error)
    {
        next(error);
    }
  };
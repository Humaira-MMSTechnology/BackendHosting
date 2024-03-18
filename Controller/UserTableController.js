const UserTable = require("../Models/UserData");
const universalFunction = require('../Functions/universalFunction');
const {MissingIds , generatePassword} = require("../commonFn.js");
const {Search} = require("../commonFn.js");
const {singleFieldSearch} = require("../commonFn.js");
const excel = require("exceljs");
const fs = require("fs");
const path = require("path");


// function generatePassword(length) {
//     const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
//     const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
//     const numbers = '0123456789';
//     const specialCharacters = '!@#$%^&*()-_';

//     const allCharacters = uppercaseLetters + lowercaseLetters + numbers + specialCharacters;

//     let password = '';

//     for (let i = 0; i < length; i++) {
//         const randomIndex = Math.floor(Math.random() * allCharacters.length);
//         password += allCharacters[randomIndex];
//     }

//     return password;
// }



exports.saveUserData = (async (request, response, next) => {
    try {  
           
        const {
            userName = "Humaira",
            displayName = "Humaira samani",
        } = request.body;


        // const generatedPassword = generatePassword(10); // Change 10 to whatever length you desire
        // console.log(generatedPassword);

        let id;

        const missingIds = await MissingIds(UserTable);
        
        if(missingIds.length > 0){
            id = missingIds[0];
        }else{
        const maxIdUser = await UserTable.findOne({}, {}, { sort: { id: -1 } });
         id = maxIdUser ? maxIdUser.id+1:1;
        }

        const userData = await UserTable.find({userName:userName}).countDocuments();
        if (userData > 0 ) {
            return response.status(409).send({
                status: "FAILURE",
                message: "User  already exist"
            });

        }           
     
        const userDetailsCheck = new UserTable();
        userDetailsCheck.id=id;
        userDetailsCheck.userName = userName.trim();
        userDetailsCheck.displayName=displayName;
        const pass = await generatePassword(10);
        userDetailsCheck.mpin = pass;
       userDetailsCheck.password = pass;
       
       console.log(userDetailsCheck);

    //    console.log(/)
        
        console.log(userDetailsCheck.password);
        console.log("userDetails", userDetailsCheck);
       
        const userdetails = userDetailsCheck.save(async function (error, saveResult) {
            if (error) { throw new Error(error); }
  
            
            let responseData = {
                status: "SUCCESS",
                message: "User data save successfully",
                data: userdetails,
                Enc_pass:pass 
                            
            }; universalFunction.sendResponse(request, response, responseData, next);
            }
   
        );
        
        
    } catch (error) {
        console.log(error);
        next(error);
        
       
    }

});

/*
exports.getAllUserDataListSearch = async function (request, response, next) {
    try {

        const missingIds = await MissingIds();
        console.log("Missing IDs:", missingIds);

        var userDetailsList = await UserTable.find().sort({ _id: 1 });;

        // await UserTable.find().sort({ _id: 1 });

        if (userDetailsList.length === 0) {
            return response.status(400).send({
                status: "FAILURE",
                message: "User data not found"
            });
        }

        let responseData = {
            status: "SUCCESS",
            message: "List of all user data",
            data: {
                userDetailsList: userDetailsList,
                count: userDetailsList.length,
            },
        };

        // Ensure that the response data is always an array
        responseData.data.userDetailsList = userDetailsList;

        universalFunction.sendResponse(request, response, responseData, next);

    } catch (error) {
        next(error);
    }
};
*/


exports.getAllUserDataSearch = async function (request, response, next) {
    try {
        var userDetailsList = await UserTable.find().sort({ id: 1 });

        if (userDetailsList.length === 0) {
            return response.status(400).send({
                status: "FAILURE",
                message: "User data not found"
            });
        }

        let responseData = {
            status: "SUCCESS",
            message: "List of all user data",
            data: {
                userDetailsList: userDetailsList,
                count: userDetailsList.length,
            },
        };
        responseData.data.userDetailsList = userDetailsList;

        response.status(200).json(responseData);

    } catch (error) {
        next(error);
    }
};



// exports.getAllUserDataList = async function (request, response, next) {
//     try {
//         // Parse page and limit parameters from query string
//         const page = parseInt(request.query.page) || 1;
//         const limit = parseInt(request.query.limit) || 2; // Default limit is 10, you can adjust it as needed

//         // Calculate the number of documents to skip
//         const skip = (page - 1) * limit;

//         // Fetch user data with pagination
//         var userDetailsList = await UserTable.find()
//             .sort({ id: 1 })
//             .skip(skip)
//             .limit(limit);

//         if (userDetailsList.length === 0) {
//             return response.status(400).send({
//                 status: "FAILURE",
//                 message: "User data not found"
//             });
//         }

//         let responseData = {
//             status: "SUCCESS",
//             message: "List of all user data",
//             data: {
//                 userDetailsList: userDetailsList,
//                 count: userDetailsList.length,
//             },
//         };

//         response.status(200).json(responseData);
//     } catch (error) {
//         next(error);
//     }
// };

// exports.getAllUserDataList = async function (request, response, next) {
//     try {
//         // Parse page and limit parameters from query string
//         const page = parseInt(request.query.page) || 1;
//         const limit = parseInt(request.query.limit) || 10; // Default limit is 10, you can adjust it as needed

//         // Calculate the number of documents to skip
//         const skip = (page - 1) * limit;

//         // Fetch user data with pagination
//         const userDetailsList = await UserTable.find()
//             .sort({ id: 1 })
//             .skip(skip)
//             .limit(limit);

//         // Count total number of documents
//         const totalCount = await UserTable.countDocuments();

//         // Calculate total pages
//         const totalPages = Math.ceil(totalCount / limit);

//         const responseData = {
//             status: "SUCCESS",
//             message: "List of all user data",
//             data: {
//                 userDetailsList: userDetailsList,
//                 currentPage: page,
//                 totalPages: totalPages,
//                 totalItems: totalCount
//             }
//         };

//         response.status(200).json(responseData);
//     } catch (error) {
//         next(error);
//     }
// };


// exports.getAllUserDataList = async function (request, response, next) {
//     try {
//         // const limit = 25; // Set the limit to 25 records per page

//         // Parse page parameter from query string
//         const page = parseInt(request.query.page) || 1;
//         const limit = parseInt(request.query.limit) || 25;
//         // const sort = p

//         // Calculate the number of documents to skip
//         const skip = (page - 1) * limit;

//         // Fetch user data with pagination
//         const userDetailsList = await UserTable.find()
//             .sort({ id: 1 })
//             .skip(skip)
//             .limit(limit);

//         // Count total number of documents
//         const totalCount = await UserTable.countDocuments();

//         // Calculate total pages
//         const totalPages = Math.ceil(totalCount / limit);

//         const responseData = {
//             status: "SUCCESS",
//             message: "List of all user data",
//             data: {
//                 userDetailsList: userDetailsList,
//                 currentPage: page,
//                 totalPages: totalPages,
//                 totalItems: totalCount
//             }
//         };

//         response.status(200).json(responseData);
//     } catch (error) {
//         next(error);
//     }
// };

exports.columnSearch=async function (request,response,next){
    try{
        const { id, userName, displayName , } = request.query;
        const limit = parseInt(request.query.limit);
        const page = parseInt(request.query.page);
        const orderBy = request.query.orderBy;

        let query = {};

        let sortQuery = {};

        if (orderBy) {
            if (orderBy === 'id_desc') {
                sortQuery = { id: -1 }; // Sort by id in descending order
            } else if (orderBy === 'id') {
                sortQuery = { id: 1 }; // Sort by id in ascending order
            } else if (orderBy === 'username') {
                sortQuery = { userName: 1 }; // Sort by username in ascending order
            } else if (orderBy === 'username_desc') {
                sortQuery = { userName: -1 }; // Sort by username in descending order
            } else if (orderBy === 'displayname') {
                sortQuery = { displayName: 1 }; // Sort by display name in ascending order
            } else if (orderBy === 'displayname_desc') {
                sortQuery = { displayName: -1 }; // Sort by display name in descending order
            }
            // Add more conditions for other fields if needed
        } else {
            // Set default sorting order to sort by ID in ascending order
            sortQuery = { id: 1 };
        }

        const skip = (page - 1 ) * limit;


        if (id) {
            query.id = parseInt(id); // Match exact ID
        }

        if (userName) {
            query.userName = new RegExp(userName, 'i'); // Match partial username
        }

        if (displayName) {
            query.displayName = new RegExp(displayName, 'i'); // Match partial displayName
        }



        const users = await UserTable.find(query) .sort(sortQuery)
        .skip(skip)
        .limit(limit);

        const totalCount = await UserTable.countDocuments(query);

        const totalPage = Math.ceil(totalCount / limit);

        len = users.length
        console.log(len);
  
     response.status(200).json({ message: "Search result", success:true , data:users  , currentPage:parseInt(page) , totalPages:totalPage , totalItems:totalCount });

    }catch(err){
        console.error("Error searching users:", err);
        response.status(500).json({ error: "Internal server error" });
    }
}


exports.getAllUserDataList = async function (request, response, next) {
    try {
        // if(!request.user){
        //     return response.status(401).json({
        //         status: "FAILURE",
        //         message: "Unauthorized access"
        //     });
        // }
        const page = parseInt(request.query.page) || 1;
        const limit = parseInt(request.query.limit) || 25;
        const orderBy = request.query.orderBy; 

        const skip = (page - 1) * limit;
        let sortQuery = {}; // Initialize an empty object for sorting query

        // Define sorting query based on the orderBy parameter
        if (orderBy) {
            if (orderBy === 'id_desc') {
                sortQuery = { id: -1 }; // Sort by id in descending order
            } else if (orderBy === 'id') {
                sortQuery = { id: 1 }; // Sort by id in ascending order
            } else if (orderBy === 'username') {
                sortQuery = { userName: 1 }; // Sort by username in ascending order
            } else if (orderBy === 'username_desc') {
                sortQuery = { userName: -1 }; // Sort by username in descending order
            } else if (orderBy === 'displayname') {
                sortQuery = { displayName: 1 }; // Sort by display name in ascending order
            } else if (orderBy === 'displayname_desc') {
                sortQuery = { displayName: -1 }; // Sort by display name in descending order
            }
            // Add more conditions for other fields if needed
        } else {
            // Set default sorting order to sort by ID in ascending order
            sortQuery = { id: 1 };
        }

        const userDetailsList = await UserTable.find()
         .collation({ locale: 'en', strength: 2 }) 
            .sort(sortQuery) // Apply sorting based on sortQuery
            .skip(skip)
            .limit(limit);

        const totalCount = await UserTable.countDocuments();
        const totalPages = Math.ceil(totalCount / limit);

        const responseData = {
            status: "SUCCESS",
            message: "List of all user data",
            data: {
                userDetailsList: userDetailsList,
                currentPage: page,
                totalPages: totalPages,
                totalItems: totalCount
            }
        };

        response.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

exports.exportToExcel= async (req,res) => {
    try{
    const users = await UserTable.find();
    console.log(users);
    console.log(users.length);

    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet("Users");

    worksheet.addRow(["id","userName","displayName"]);

    users.forEach(user => {
        worksheet.addRow([user.id,user.userName,user.displayName]);

    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');

    workbook.xlsx.write(res)
    .then(() =>{
        res.end();
    })
    .catch(err =>{
        console.error('Error writing Excel file:', err);
                res.status(500).send('Internal Server Error');
    });

    }
    catch(err){
        console.error('Error exporting data:', err);
        res.status(500).send('Internal Server Error');
    }

}



// exports.getOneData = async function (request , response , next ){
//     try {
//         let {userId} = request.params;

//         const existingUser = await UserTable.findById(userId);
    
//         if (!existingUser) {
//             return response.status(404).send({
//                 status: "FAILURE",
//                 message: "User not found"
//             });
//         }

//         let responseData = {
//             status: "SUCCESS",
//             message: "User data updated successfully",
//             data: existingUser
//         };

//         // Send response to frontend
//         response.status(200).json(responseData);

//     } catch(error) {
//         console.log(error);
//         next(error);
//     }
// }

exports.getOneData = async function (request , response , next ){

    try{

        let {userId} = request.params;

        const existingUser = await UserTable.findById(userId);
    
        if (!existingUser) {
            return response.status(404).send({
                status: "FAILURE",
                message: "User not found"
            });
        }

        let responseData = {
            status: "SUCCESS",
            message: "User data updated successfully",
            data: existingUser
        };

        universalFunction.sendResponse(request, response, responseData, next);
    }catch(error){
        console.log(error);
        next(error);
    }
   

}


exports.updateUserDetails = async function (request, response, next) {
    try {
        const userId = request.params.userId;
        const { userName, displayName } = request.body;

        const existingUser = await UserTable.findById(userId);

        if (!existingUser) {
            return response.status(404).send({
                status: "FAILURE",
                message: "User not found"
            });
        }

        const updatedFields = {};
        if (displayName !== undefined) {
            updatedFields.displayName = displayName;
        } else {
            updatedFields.displayName = existingUser.displayName;
        }

        if (userName !== undefined) {
            updatedFields.userName = userName.trim();
        }else {
            updatedFields.userName = existingUser.userName;
        }

        const updatedUser = await UserTable.findByIdAndUpdate(userId, updatedFields, { new: true });

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


exports.updateUserPassword = async function (request, response, next) {
    try {
        const userId = request.params.userId;
        const { password } = request.body;

        const existingUser = await UserTable.findById(userId);

        if (!existingUser) {
            return response.status(404).send({
                status: "FAILURE",
                message: "User not found"
            });
        }

        const updatedFields = {};
        if (password !== undefined) {
            updatedFields.password = password;
        } else {
            updatedFields.password = existingUser.password;
        }
        const updatedUser = await UserTable.findByIdAndUpdate(userId, updatedFields, { new: true });

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

  exports.deleteUser = async function(request, response, next) {
    try {
        const  userId  = request.params.id;
                
        const userDetails = await UserTable.findById(userId);

        if (!userDetails) {
            return response.status(400).send({
                status: "FAILURE",
                message: "User data not found"
            });
        }

        let dinalDel = await UserTable.findByIdAndDelete(userId);
        console.log(dinalDel);


        let responseData = {
            status: "SUCCESS",
            message: "Delete user details successfully",
            data: []
        };

        universalFunction.sendResponse(request, response, responseData, next);

    } catch (error) {
        next(error);
    }
};


// module.exports.search = async (req,res) =>{  
//     try {
//         const { q } = req.query;
//         const searchResult = await UserTable.find({
//             $or: [
//                 { userName: { $regex: q, $options: 'i' } },
//                 { displayName: { $regex: q, $options: 'i' } },
//                 {id: isNaN(parseInt(q)) ? null : parseInt(q)}
//             ]
//         });

//         if (!searchResult || searchResult.length === 0) {
//             return res.status(404).json({ message: "No user found" });
//         }

//         res.status(200).json({ message: "Search result", searchResult });
//     } catch (err) {
//         res.status(500).json({ message: "Error in search",  err });
//     }
// }

module.exports.Search = async function (req,res){
    try{

         const { searchResult, totalCount, page, totalPage }  = await Search(req,UserTable,"userName", "displayName", "id");

        
        if (!searchResult || totalCount === 0) {
            return res.status(404).json({ message: "No user found" });
        }

        const totalItems = totalCount;

        res.status(200).json({ message: "Search result", success:true , data:searchResult  , currentPage:parseInt(page) , totalPages:totalPage , totalItems:totalCount });
        
    }catch(err){
        res.status(500).json({ message: "Error in search",  err });
    }
   
}

module.exports.SearchById = async function (request,response,next){
    try {
                const { q } = request.query;
                const searchResult = await UserTable.find({id:parseInt(q)});
        
                if (!searchResult || searchResult.length === 0) {
                    return response.status(404).json({ message: "No user found" });
                }
        
                response.status(200).json({ message: "Search result", searchResult });
        } catch (err) {
            response.status(500).json({ message: "Error in search",  err });
        }
}

module.exports.SearchByUserName = async function (request,response,next){
    try {

        const search =  await singleFieldSearch(request,UserTable,"userName");

        if(!search || search.length === 0){
            return response.status(404).json({ message: "No user found" });
        }
        response.status(200).json({ message: "Search by username : ", search });
        } catch (err) {
            response.status(500).json({ message: "Error in search of username",  err });
        } 

}

module.exports.SearchByDisplayName = async function (request,response,next){
    try {

        const search =  await singleFieldSearch(request,UserTable,"displayName");

        if(!search || search.length === 0){
            return response.status(404).json({ message: "No user found" });
        }
        response.status(200).json({ message: "Search by displayName : ", search });
        } catch (err) {
            response.status(500).json({ message: "Error in search of displayName",  err });
        } 
}
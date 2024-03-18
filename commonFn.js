const UserTable = require("./Models/UserData.js");

const MissingIds = async function(collectionName) {
    try {
      
        const maxIdUser = await collectionName.findOne({}, {}, { sort: { id: -1 } }); 
        const minIdUser = await collectionName.findOne({}, {}, { sort: { id: 1 } }); 

        const maxId = maxIdUser ? maxIdUser.id : 1;
        const minId = minIdUser ? minIdUser.id : 1;

      
        const allIds = Array.from({ length: maxId }, (_, i) => i + 1);

    
        const existingIds = (await collectionName.find({}, 'id')).map(user => user.id);
        const missingIds = allIds.filter(id => !existingIds.includes(id));

        return missingIds;
    } catch (error) {
        console.error("Error finding missing IDs:", error);
        throw error;
    }
}

// [search]

const Search = async function(req,collectionName,field1,field2,field3){
    try {
        const { q } = req.query;
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const orderBy = req.query.orderBy;

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

        // const allUser = await UserTable.find

        const searchResult = await collectionName.find({
            $or: [
                { [field1]: { $regex: q, $options: 'i' } },
                { [field2]: { $regex: q, $options: 'i' } },
                { [field3]: isNaN(parseInt(q)) ? null : parseInt(q)}  
            ]
        })
        .sort(sortQuery)
        .skip(skip)
        .limit(limit);

        // Get total count using countDocuments()
        const totalCount = await collectionName
        .countDocuments({
            $or: [
                { [field1]: { $regex: q, $options: 'i' } },
                { [field2]: { $regex: q, $options: 'i' } },
                {
                    $and: [
                        { [field3]: { $exists: true } }, // Ensure the field exists
                        { [field3]: isNaN(parseInt(q)) ? null : parseInt(q) } // Exact match for numeric fields
                    ]
                }
            ]
        });
        

        // const totalCount = await searchResult.length;
        const totalPage = Math.ceil(totalCount / limit);
       

        return {searchResult , page   , totalCount , totalPage}  ;
    } catch (err) {
        console.error("Error in search of commonFn.js file humaira:", err);
        throw err;
    }
}


// [ search a single field ]



// const { db } = require('./your-database-module'); // Import your database module
/*
const tempCollectionPrefix = "temp_"; // Define a fixed prefix for temporary collections

const Search = async function(req, collectionName, field1, field2, field3) {
    try {
        const { q } = req.query;
        const limit = parseInt(req.query.limit);
        const page = parseInt(req.query.page);
        const orderBy = req.query.orderBy;

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

        const skip = (page - 1) * limit;

        // Save search results to the temporary collection
        const searchQuery = {
            $or: [
                { [field1]: { $regex: q, $options: 'i' } },
                { [field2]: { $regex: q, $options: 'i' } },
                { [field3]: isNaN(parseInt(q)) ? null : parseInt(q) }
            ]
        };


           // Find documents matching the search query and sort them
           const searchResult = await collectionName
           .find(searchQuery)
           .sort(sortQuery)
           .skip(skip)
           .limit(limit);


            // Get total count using countDocuments()
        const totalCount = await collectionName.countDocuments(searchQuery);
        const totalPage = Math.ceil(totalCount / limit);

        // Here, you can save the search results to a temporary collection
        const tempCollection = `temp_${Date.now()}`;
        await collectionName.db.collection(tempCollection).insertMany(searchResult);

        return { searchResult, page, totalCount, totalPage };
    } catch (err) {
        console.error("Error in search of commonFn.js file humaira:", err);
        throw err;
    }
}
*/

// module.exports = Search;




const singleFieldSearch = async function(request,collectionName,fieldName){
    try {
        const { q } = request.query;
        const searchResult = await collectionName.find({ [fieldName] : {$regex:q , $options: 'i'}});

        return searchResult;

    } catch (err) {
        console.error("Error in commonFn.js at singleFieldSearch",err);
        throw err;
    }
}

const  generatePassword = function (length) {
    const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialCharacters = '!@#$%^&*()-_';

    const allCharacters = uppercaseLetters + lowercaseLetters + numbers + specialCharacters;

    let password = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex];
    }

    return password;
}

module.exports = {MissingIds,Search,singleFieldSearch , generatePassword};
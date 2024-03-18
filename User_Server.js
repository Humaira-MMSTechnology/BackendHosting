require('./db/connection');
const cors = require("cors");
const path = require("path");
const express = require("express");
const app = express();
const Port = process.env.PORT || 9000;
const userRouter = require('./Routes/UserRoutes/UserRoute');
const userTableRouter = require('./Routes/UserRoutes/UserData');
const userTable = require("./Models/UserData.js");                  
const missingIds = require("./commonFn.js");
const categoryRoutes = require("./Routes/categoryRoutes/category.js");
const BrandRouter = require("./Routes/BrandRoutes/Brand.js");
const multer = require('multer');
const xlsx = require("xlsx");
const fs = require("fs");
const BrandD = require("./Models/Brand.js");
const {MissingIds , generatePassword } = require("./commonFn.js");


// const corsOptions = {
//     origin: 'http://localhost:60924', // Allow requests from this origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
// };
  
app.use(cors());

const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({extended:false}));
// app.use(cors());
// Parse JSON bodies
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/uploadBrand',async (req,res) => {

    const base64Data = req.body.data;
    const buffer = Buffer.from(base64Data,'base64');

       // Load Excel workbook
       const workbook = xlsx.read(buffer, { type: 'buffer' });
       const sheetName = workbook.SheetNames[0];
       const worksheet = workbook.Sheets[sheetName];

       const jsonData = xlsx.utils.sheet_to_json(worksheet);
       const uniqueData = [];
       const processedIds = new Set();
       const processedBrandsName = new Set();

       for (const record of jsonData) {
        // Check if ID or username already exists
        if (processedIds.has(record.id) || processedBrandsName.has(record.BrandName)) {
            // Skip this record
            continue;
        }

        const existingIdRecord = await BrandD.findOne({ id: record.id });
        const existingBrandnameRecord = await BrandD.findOne({ BrandName: record.BrandName });

        if (!existingIdRecord && !existingBrandnameRecord) {
            // Record does not exist, add it to the uniqueData array and update sets
            uniqueData.push(record);
            processedIds.add(record.id);
            processedBrandsName.add(record.BrandName);
        }
    }
    try {
        // await BrandD.deleteMany({});
        await BrandD.insertMany(uniqueData);
        res.json('File uploaded and processed successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({message:'Some data already exist'});
    }
});

app.post('/uploadBrandDelete', upload.single('file'), async (req, res) => {
    try {
        const base64Data = req.body.data;
        const buffer = Buffer.from(base64Data, 'base64');

        // Load Excel workbook
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert worksheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Extract unique IDs or usernames from the Excel data
        const uniqueIds = new Set();
        const uniqueBrandNames = new Set();
        // const uniqueDisplaynames = new Set();

        for (const record of jsonData) {
            uniqueIds.add(record.id);
            uniqueBrandNames.add(record.BrandName);
            // uniqueDisplaynames.add(record.displayName);
        }

        // Find and delete records from the database that are not in the Excel file
        await BrandD.deleteMany({
            $or: [
                { id: { $nin: Array.from(uniqueIds) } },
                { BrandName: { $nin: Array.from(uniqueBrandNames) } },
                // {displayName: {$nin: Array.from(uniqueDisplaynames)}  }
            ]
        });

        // Filter out records from Excel data that are already present in the database
        const recordsToInsert = [];
        for (const record of jsonData) {
            const existingRecord = await BrandD.findOne({ $or: [{ id: record.id }, { BrandName: record.BrandName }] });
            if (!existingRecord) {
                recordsToInsert.push(record);
            }
        }

        // Insert new data
        await BrandD.insertMany(recordsToInsert);

        res.json('File uploaded and processed successfully');
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
});

/*
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const base64Data = req.body.data;
        const buffer = Buffer.from(base64Data, 'base64');

        // Load Excel workbook
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert worksheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Loop through each record in the Excel data
        for (const record of jsonData) {
            // Find existing record by ID
            const existingRecord = await userTable.findOne({ id: record.id });

            if (existingRecord) {
                // Update the existing record with the new values
                // existingRecord.id = record.id;
                existingRecord.userName = record.userName;
                existingRecord.displayName = record.displayName;
                await existingRecord.save();
            } else {
                // Insert new record if no existing record with the same ID
                await userTable.create(record);
            }
        }

        res.json('File uploaded and processed successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
});

sahi
*/

app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const base64Data = req.body.data;
        const buffer = Buffer.from(base64Data, 'base64');

        // Load Excel workbook
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert worksheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Get missing IDs
        const missingIds = await MissingIds(userTable);

        // Loop through each record in the Excel data
        for (const record of jsonData) {
            // Assign ID if not present in the Excel file
            const pass = generatePassword(10);
            record.mpin = pass;
            record.password = pass;
            if (!record.id) {
                if (missingIds.length > 0) {
                    record.id = missingIds.shift();
                } else {
                    // If no missing IDs are available, generate a new ID
                    const maxId = Math.max(...jsonData.map(item => item.id || 0));
                    record.id = maxId + 1;
                }
            }

            // Find existing record by indexing all fields
            const existingRecord = await userTable.findOne({ id: record.id });

            if (existingRecord) {
                // Update the existing record with the new values
                // existingRecord.id = record.id;
                existingRecord.userName = record.userName;
                existingRecord.displayName = record.displayName;
                await existingRecord.save();
            } else {
                // Insert new record if no existing record matches all fields
                await userTable.insertMany(record);
            }
        }

        res.json('File uploaded and processed successfully');
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
});

app.post('/uploadDel', upload.single('file'), async (req, res) => {
    try {
        const base64Data = req.body.data;
        const buffer = Buffer.from(base64Data, 'base64');

        // Load Excel workbook
        const workbook = xlsx.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert worksheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Extract unique IDs or usernames from the Excel data
        const uniqueIds = new Set();
        const uniqueUsernames = new Set();
        const uniqueDisplaynames = new Set();

        for (const record of jsonData) {
            uniqueIds.add(record.id);
            uniqueUsernames.add(record.userName);
            uniqueDisplaynames.add(record.displayName);
        }

        // Find and delete records from the database that are not in the Excel file
        await userTable.deleteMany({
            $or: [
                { id: { $nin: Array.from(uniqueIds) } },
                { userName: { $nin: Array.from(uniqueUsernames) } },
                {displayName: {$nin: Array.from(uniqueDisplaynames)}  }
            ]
        });

        // Filter out records from Excel data that are already present in the database
        const recordsToInsert = [];
        for (const record of jsonData) {
            const existingRecord = await userTable.findOne({ $or: [{ id: record.id }, { userName: record.userName } , {displayName: record.displayName}] });
            if (!existingRecord) {
                recordsToInsert.push(record);
            }
        }

        // Insert new data
        await userTable.insertMany(recordsToInsert);

        res.json('File uploaded and processed successfully');
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ message: 'Error processing file' });
    }
});

app.get("/getOneDetails/:id",async ( req,res) =>{
    let { id } = req.params;
    try{
        const getData = await userTable.findById(id);

        if(!getData){
            return res.json({message: "User does not exist"});
        }
        return res.json({getData});
    }catch(err){
        return res.json(err);
    }
});

app.use('/user', userRouter.Router);
app.use('/userTable', userTableRouter.Router);
app.use("/category",categoryRoutes);
app.use("/Brand",BrandRouter);

app.post("/random",async (req,res) =>{
    res.send("yess Humaira!!");
    // let idds = await missingIds(userTable);
    // console.log("missing ids are:",idds);
});

app.listen(Port, () => { 
    console.log(`Server is running on port number ${Port}`)
});
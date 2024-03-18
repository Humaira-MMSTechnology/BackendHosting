const Brand = require("../../Models/Brand.js");
const {MissingIds} = require("../../commonFn.js");
const universalFunction = require('../../Functions/universalFunction.js');

module.exports.allBrandDetails = async (request,response) =>{
    try{
        let allBrand = await Brand.find({}).sort({id:1});

        if (!allBrand || allBrand.length === 0 ){
           return response.json({message:"Brand is not there"});
        }

        response.json({message:"All Brand Details:",allBrand});
    }catch(err){
        response.json({message:"Error , In catch block of Brand details fetching ",err});
    }
};

module.exports.new = async (request,response,next) =>{

    try{
    let { BrandName } = request.body;

    let id;         
  
    const missingIds = await MissingIds(Brand);

    if(missingIds.length > 0){
        id = missingIds[0];
    }else{

    const maxIdUser = await Brand.findOne({}, {}, { sort: { id: -1 } });

     id = maxIdUser ? maxIdUser.id+1:1;
    }

    const existBrand = await Brand.find({BrandName:BrandName}).countDocuments();

    if (existBrand > 0 ) {
        return response.status(409).send({
            status: "FAILURE",
            message: "Brand already exist"
        });

    } 

    const BrandDetailsCheck = new Brand();
    BrandDetailsCheck.id = id;
    BrandDetailsCheck.BrandName = BrandName;

    
    const Branddetails = BrandDetailsCheck.save(async function (error, saveResult) {
        if (error) { throw new Error(error); }

        
        let responseData = {
            status: "SUCCESS",
            message: "Brand details save successfully",
            data: Branddetails
                        
        }; universalFunction.sendResponse(request, response, responseData, next);
        }

    );

    }catch(err){
        console.log(err);
        next(err);
    }
};

module.exports.deleteBrand = async (req,res) =>{
    try{
        let { id } = req.params;

        let toDelete = await Brand.findByIdAndDelete(id);
        
        if(!toDelete){
            return res.json({message:"Brand to delete not found"});
        }

        res.json({message:"Brand deleted",toDelete});

    }catch(err){
        res.json({message:"Error , In catch block of delete Brand"});
    }
}

module.exports.updateBrandDetails = async (req,res) =>{
    try{

        let {BrandId} = req.params;
        let  {BrandName} = req.body;

        console.log(BrandName);

        let existBrand = await Brand.findById(BrandId);

        let updateBrand = await Brand.findByIdAndUpdate(BrandId , {BrandName : BrandName});
        updateBrand.BrandName = BrandName;

        if(!existBrand){
           return res.json({message:"Brand not found"});
        }

        res.json({message : "Brand details updated successfully" , updateBrand});


    }catch(err){
        res.json({error:"Error in updation of brand details",err});
    }
}

module.exports.getOneBrandDetails = async (request,response,next) =>{
    try{

        let {id} = request.params;

        const existingBrand = await Brand.findById(id);
    
        if (!existingBrand) {
            return response.status(404).send({
                status: "FAILURE",
                message: "Brand not found"
            });
        }

        let responseData = {
            status: "SUCCESS",
            message: "Brand data updated successfully",
            data: existingBrand
        };

        universalFunction.sendResponse(request, response, responseData, next);
    }catch(error){
        console.log(error);
        next(error);
    }
}
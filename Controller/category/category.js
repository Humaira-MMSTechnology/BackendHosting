const category = require("../../Models/category.js");
const {MissingIds} = require("../../commonFn.js");
const universalFunction = require('../../Functions/universalFunction.js');

module.exports.allCatDetails = async (req,res) =>{
    try{
        let allCategory = await category.find({}).sort({id:1});

        if (!allCategory || allCategory.length === 0 ){
           return res.json({message:"category is not there"});
        }

        res.json({message:"All category details : ",allCategory});
    }catch(err){
        res.json({message:"Error , In catch block of all category details fetching ",err});
    }
};

module.exports.new = async (request,response,next) =>{

    try{



        let { catName } = request.body;

        let id;         
      
        const missingIds = await MissingIds(category);
    
        if(missingIds.length > 0){
            id = missingIds[0];
        }else{
    
        const maxIdUser = await category.findOne({}, {}, { sort: { id: -1 } });
    
         id = maxIdUser ? maxIdUser.id+1:1;
        }
    
        const existCategory = await category.find({catName:catName}).countDocuments();
    
        if (existCategory > 0 ) {
            return response.status(409).send({
                status: "FAILURE",
                message: "category already exist"
            });
    
        }
    
        const CategoryDetailsCheck = new category();
        CategoryDetailsCheck.id = id;
        CategoryDetailsCheck.catName = catName;
    
        
        const categorydetails = CategoryDetailsCheck.save(async function (error, saveResult) {
            if (error) { throw new Error(error); }
    
            
            let responseData = {
                status: "SUCCESS",
                message: "category details save successfully",
                data: categorydetails
                            
            }; universalFunction.sendResponse(request, response, responseData, next);
            }
    
        );



    }catch(err){
        res.json({message:"can't add new category",err});
    }
};

module.exports.deleteCat = async (req,res) =>{
    try{
        let { id } = req.params;

        let toDelete = await category.findByIdAndDelete(id);

        if(!toDelete){
            return res.json({error:"Category not found"});
        }

        res.json({message:"category deleted",toDelete});

    }catch(err){
        res.json({message:"Error , In catch block of delete category",err});
    }
}

module.exports.updateCatDetails = async (req,res) =>{
    try{

        let {CatId} = req.params;
        let  {catName} = req.body;

        let existCat = await category.findById(CatId);

        let updateCat = await category.findByIdAndUpdate(CatId , {catName : catName});
        updateCat.catName = catName;

        if(!existCat){
           return res.json({message:"category not found"});
        }

        res.json({message : "category details updated successfully" , updateCat});

    }catch(err){
        res.json({error:"Error in catch block of update category details",err});
    }

} 

module.exports.getOneCatDetails = async (request,response,next) =>{
    try{

        let {catId} = request.params;

        const existingCategory = await category.findById(catId);
    
        if (!existingCategory) {
            return response.status(404).send({
                status: "FAILURE",
                message: "category not found"
            });
        }

        let responseData = {
            status: "SUCCESS",
            message: "category data updated successfully",
            data: existingCategory
        };

        universalFunction.sendResponse(request, response, responseData, next);
    }catch(error){
        console.log(error);
        next(error);
    }
}
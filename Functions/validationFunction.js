const Ajv = require("ajv")
const ajv = new Ajv({allErrors: true})
require("ajv-errors")(ajv /*, {singleError: true} */)

const { error } = require("ajv/dist/vocabularies/applicator/dependencies");
const { default: ajvErrors } = require("ajv-errors");



exports.validateUser=(reqobj)=>{
    return(request,response,next)=>{
    // console.log(request.body);
        const ajvValidator = ajv.compile(reqobj);
            
      const valid = ajvValidator(request.body); 
     // console.log("valid/////", valid);
        /* if(Object.keys(request.body).length===0 && request.body.constructor===Object )
           {
            var valid=ajvValidator(request.query); 
          }else{
            var valid=ajvValidator(request.body)  
           }
           */
            const extractedErrors=[]; 
        if (!valid)
          {          
                    const errors=ajvValidator.errors;
                    // console.log(errors);
        
                    errors.map((err)=>{
                        extractedErrors.push(err.message);
                 
                    });
            }
      
                if(Object.keys(extractedErrors).length > 0){
                    return response.status(422).json({
                        status:"422",
                        message:extractedErrors,
                    });
                }
               else{
                 next();                   
                }
      
                   }
           
        
    }

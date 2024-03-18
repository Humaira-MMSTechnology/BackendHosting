
exports.userLoginSchema={
  type:"object",
  properties:{
      userName:{
          type:"string",
          
      },
      displayName:{
        type:"string",
        
    },
  
      mpin:{
          type:"string",
          minLength:6,
          maxLength:10,
               },
    
  },
  required: ["userName","mpin"]
};
exports.userCreateSchema={
    type:"object",
    properties:{
      phoneNumber: {
        type:String,
        minLength: 10,
        maxLength: 10,
        pattern: "^[0-9()-.s]+$",
    },
       
      
    },
   
};
exports.getAllUserSchemas = {

  type: "object",
  properties: {
    email: {
      type: "string",
      
    },
    
  },
  
};
exports.getOneUserSchemas = {

  type: "object",
  properties: {
    email: {
      type: "string",
      
    },
    
  },
 
};


exports.updateUserSchemas = {

  type: "object",
  properties: {
    email: {
      type: "string",
      
    },
    
  },
  

};

exports.deleteUserSchemas = {
  type: "object",
  properties: {
    email: {
      type: "string",
      
    },
    
  },

};


exports.saveUserDataSchema={
  type:"object",
  properties:{
   
      userName:{
          type:"string",
          
      },
      displayName:{
        type:"string",
        
    },
      mpin:{
        type:"string",
        minLength:6,
        maxLength:20
    },
    
  
    
  },
  required: ["userName","displayName"]
};
const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");

const userSchemas = new mongoose.Schema({

    userName: {
        type: String,
              
    },
    
    displayName: {
        type:String
    },
    phoneNumber: {
        type:String
    },
    
    encry_password:{
        type:String
    },
    authToken:{
          type:String       
     }, 
     salt: {
        type: String,
        default: "",
      },
      firebaseToken: {
        type: String,
        default: "",
    },
    mpin: {
        type: String
    }
   
})
userSchemas
.virtual("password")
.set( function(password){
  this._password=password;
  this.salt=uuidv1();
this.encry_password=this.securePassword(password); 

 })
.get(function(){
   return this._password
})

userSchemas.methods = {
   authenticate:function(plainpassword){
     console.log(this.securePassword(plainpassword));
      console.log(this.securePassword(plainpassword) + "===" + this.encry_password);
      return this.securePassword(plainpassword) === this.encry_password;
   },
  securePassword:function(plainpassword){
      //console.log("securePassword",plainpassword);
      if(!plainpassword) return "";
      try{
      return crypto
      .createHmac("sha256",this.salt)
      .update(plainpassword)
      .digest("hex");
    
   }catch(err){return "";
   } 
   },
   };
  userSchemas.methods.tOJSON = function () {
      var obj =this.toObject();
      delete obj.salt;
      return obj;
   }
module.exports=new mongoose.model("UserDetails",userSchemas);
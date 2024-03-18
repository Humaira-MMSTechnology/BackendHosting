const mongoose = require("mongoose");
const crypto = require("crypto");
const { v1: uuidv1 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretyKey = "abcdefghijklmnopqrstuvwxyzabcdef";

const userSchemas = new mongoose.Schema({
    id:{
        type:Number,
        required:true,
        unique:true
    },
    userName: {
        type: String,  
        required:true,
        unique:true    
    },
    displayName:{
        type:String,
    },
    /*    password: {
        type:String
    },*/
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
    mpin: {
        type: String
    },
   })
   userSchemas
   .virtual("password")
   .set(function(password){
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

userSchemas.method.generateAuthToken = async function(){
        try{
            let token23 = jwt.sign({_id:this._id},secretyKey,{
            expiresIn:"1d"
            });

            this.authToken = token23;
            await this.save();
            return token23;
        }catch(err){
            res.status(500).json({error: err.message});
        }
    }



module.exports=new mongoose.model("userTable",userSchemas);
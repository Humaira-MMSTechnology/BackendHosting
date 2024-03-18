const express = require("express");
const mongoose = require("mongoose");

const cSchema = mongoose.Schema({
    id: {
        type:Number,
    },
    catName: {
        type:String
    },
    parentCatId:{
        type:Number,
        default:0
    }
});

module.exports = mongoose.model("category",cSchema);
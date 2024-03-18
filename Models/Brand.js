const express = require("express");
const mongoose = require("mongoose");

const BSchema = mongoose.Schema({
    id: {
        type:Number,
    },
    BrandName: {
        type:String
    }
});

module.exports = mongoose.model("Brand",BSchema);
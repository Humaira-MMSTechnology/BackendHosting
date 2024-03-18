const express = require("express");
const Brand = require("../../Models/Brand.js");
const BrandController = require("../../Controller/Brand/Brand.js");

const Router = express.Router();

Router.get("/All", 
BrandController.allBrandDetails
);

Router.post("/new",
BrandController.new
);


Router.delete("/delete/:id",
BrandController.deleteBrand
);


Router.route('/updateBrandDetails/:BrandId').patch(
    BrandController.updateBrandDetails
);

Router.route("/getOneBrand/:id").get(
    BrandController.getOneBrandDetails
);

module.exports = Router;
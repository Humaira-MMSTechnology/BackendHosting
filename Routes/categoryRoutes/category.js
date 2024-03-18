const express = require("express");
const category = require("../../Models/category.js");
const MissingIds = require("../../commonFn.js");
const categoryController = require("../../Controller/category/category.js");

const Router = express.Router();

Router.get("/All", 
categoryController.allCatDetails
);

Router.post("/new",
categoryController.new
);


Router.delete("/delete/:id",
categoryController.deleteCat
);

Router.route("/getOneCategory/:catId").get(
    // universalFunction.authenticateUser,
    categoryController.getOneCatDetails
);

Router.route('/updateCatDetails/:CatId').patch(
    categoryController.updateCatDetails
);
module.exports = Router;
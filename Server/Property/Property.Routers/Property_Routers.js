const express = require('express');

const router = express.Router();

const propertyController = require('../Property.Controller/Property_Controller');



router.post("/create", propertyController.createProperty);



router.get("/get", propertyController.getAllProperties);



router.get("/get/:id", propertyController.getPropertyById);



router.put("/update/:id", propertyController.updateProperty);



router.delete("/delete/:id", propertyController.deleteProperty);


router.put("/status/:id", propertyController.changeStatus);


router.put("/add-image/:id", propertyController.addImage);


module.exports = router;
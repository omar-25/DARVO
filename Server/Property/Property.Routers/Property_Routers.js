const express = require('express');
const router = express.Router();
const propertyController = require('../Property.Controller/Property_Controller');


router.get('/test', (req, res) => {
    res.json({ message: 'Property routes are working!' });
});

router.post("/create", propertyController.createProperty);
router.get("/get", propertyController.getAllProperties);
router.get("/search", propertyController.searchProperties);
router.get("/get/:id", propertyController.getPropertyById);
router.put("/update/:id", propertyController.updateProperty);
router.delete("/delete/:id", propertyController.deleteProperty);
router.put("/status/:id", propertyController.changeStatus);
router.put("/add-image/:id", propertyController.addImage);

router.get("/compare/:idA/:idB", propertyController.compareProperties);

module.exports = router;
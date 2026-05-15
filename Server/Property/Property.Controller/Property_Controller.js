const Property = require('../Property.Models/Property_Models');



const createProperty = async (req, res) => {
    try {
        const {
            propertyName,
            propertyDescription,
            propertyLocation,
            propertyType,
            propertyOwner,
            propertyAmenities,
            bedrooms,
            bathrooms,
            livingArea,
            assignedSales,
            price,
            status,
            gardenArea,
            roofArea,
            offers
        } = req.body;

        if (!propertyName || !propertyDescription || !propertyLocation || !propertyType || !bedrooms || !bathrooms || !price) {
            return res.status(400).json({
                message: "Send all required fields: propertyName, propertyDescription, propertyLocation, propertyType, bedrooms, bathrooms, price"
            });
        }

        const property = await Property.create({
            propertyName,
            propertyDescription,
            propertyLocation,
            propertyType,
            propertyOwner,
            propertyAmenities,
            bedrooms,
            bathrooms,
            livingArea,
            assignedSales,
            price,
            status,
            gardenArea,
            roofArea,
            offers
        });

        return res.status(201).json({
            message: "Property created successfully",
            data: property
        });

    } catch (error) {
        console.error("createProperty error:", error);
        return res.status(500).json({ message: error.message });
    }
};



const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({})
            .populate("propertyOwner", "name email")
            .populate("assignedSales", "name email");

        return res.status(200).json({
            count: properties.length,
            data: properties
        });

    } catch (error) {
        console.error("getAllProperties error:", error);
        return res.status(500).json({ message: error.message });
    }
};



const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id)
            .populate("propertyOwner", "name email")
            .populate("assignedSales", "name email");

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        return res.status(200).json({ data: property });

    } catch (error) {
        console.error("getPropertyById error:", error);
        return res.status(500).json({ message: error.message });
    }
};



const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const ALLOWED_UPDATES = [
            "propertyName", "propertyDescription", "propertyLocation",
            "propertyType", "propertyAmenities", "bedrooms", "bathrooms",
            "livingArea", "assignedSales", "price", "gardenArea", "roofArea"
        ];

        const updates = {};
        ALLOWED_UPDATES.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided to update" });
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        return res.status(200).json({
            message: "Property updated successfully",
            data: updatedProperty
        });

    } catch (error) {
        console.error("updateProperty error:", error);
        return res.status(500).json({ message: error.message });
    }
};


// DELETE PROPERTY
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProperty = await Property.findByIdAndDelete(id);

        if (!deletedProperty) {
            return res.status(404).json({ message: "Property not found" });
        }

        return res.status(200).json({ message: "Property deleted successfully" });

    } catch (error) {
        console.error("deleteProperty error:", error);
        return res.status(500).json({ message: error.message });
    }
};


// CHANGE STATUS
const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ALLOWED_STATUSES = ["Available", "Sold", "Pending", "Rented"];

        if (!status) {
            return res.status(400).json({ message: "Status field is required" });
        }

        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`
            });
        }

        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        await property.changeStatus(status);

        return res.status(200).json({
            message: "Status updated successfully",
            data: property
        });

    } catch (error) {
        console.error("changeStatus error:", error);
        return res.status(500).json({ message: error.message });
    }
};



const addImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        await property.addImage(image);

        return res.status(200).json({
            message: "Image added successfully",
            data: property
        });

    } catch (error) {
        console.error("addImage error:", error);
        return res.status(500).json({ message: error.message });
    }
};

// SEARCH PROPERTIES
const searchProperties = async (req, res) => {
    try {

        const {
            propertyLocation,
            propertyType,
            status,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms
        } = req.query;

        let filter = {};

        // LOCATION SEARCH
        if (propertyLocation) {
            filter.propertyLocation = {
                $regex: propertyLocation,
                $options: "i"
            };
        }

        // PROPERTY TYPE
        if (propertyType) {
            filter.propertyType = propertyType;
        }

        // STATUS
        if (status) {
            filter.status = status;
        }

        // BEDROOMS
        if (bedrooms) {
            filter.bedrooms = Number(bedrooms);
        }

        // BATHROOMS
        if (bathrooms) {
            filter.bathrooms = Number(bathrooms);
        }

        // PRICE FILTER
        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte = Number(maxPrice);
            }
        }

        const properties = await Property.find(filter)
            .populate("propertyOwner", "name email")
            .populate("assignedSales", "name email");

        return res.status(200).json({
            count: properties.length,
            data: properties
        });

    } catch (error) {
        console.error("searchProperties error:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    searchProperties,
    changeStatus,
    addImage
};
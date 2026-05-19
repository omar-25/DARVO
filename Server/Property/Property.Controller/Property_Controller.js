const Property = require('../Property.Models/Property_Models');

const createProperty = async (req, res) => {
    try {
        console.log("Received body:", req.body); // Debug log
        
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
            offers,
            images
        } = req.body;

  
        if (!propertyName || !propertyDescription || !propertyLocation || !propertyType || !bedrooms || !bathrooms || !price) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: propertyName, propertyDescription, propertyLocation, propertyType, bedrooms, bathrooms, price"
            });
        }

        const property = await Property.create({
            propertyName,
            propertyDescription,
            propertyLocation,
            propertyType,
            propertyOwner: propertyOwner || null,
            propertyAmenities: propertyAmenities || [],
            bedrooms,
            bathrooms,
            livingArea: livingArea || null,
            assignedSales: assignedSales || null,
            price,
            status: status || 'Pending Review',
            gardenArea: gardenArea || 0,
            roofArea: roofArea || 0,
            offers: offers || [],
            images: images || []
        });

        return res.status(201).json({
            success: true,
            message: "Property created successfully",
            data: property
        });

    } catch (error) {
        console.error("createProperty error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find({status: 'Available'})
            .populate("propertyOwner", "name email")
            .populate("assignedSales", "name email");

        return res.status(200).json({
            success: true,
            count: properties.length,
            data: properties
        });

    } catch (error) {
        console.error("getAllProperties error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        const property = await Property.findById(id)
            .populate("propertyOwner", "name email")
            .populate("assignedSales", "name email");

        if (!property) {
            return res.status(404).json({ 
                success: false,
                message: "Property not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            data: property 
        });

    } catch (error) {
        console.error("getPropertyById error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const ALLOWED_UPDATES = [
            "propertyName", "propertyDescription", "propertyLocation",
            "propertyType", "propertyAmenities", "bedrooms", "bathrooms",
            "livingArea", "assignedSales", "price", "gardenArea", "roofArea", "images"
        ];

        const updates = {};
        ALLOWED_UPDATES.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ 
                success: false,
                message: "No valid fields provided to update" 
            });
        }

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedProperty) {
            return res.status(404).json({ 
                success: false,
                message: "Property not found" 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Property updated successfully",
            data: updatedProperty
        });

    } catch (error) {
        console.error("updateProperty error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProperty = await Property.findByIdAndDelete(id);

        if (!deletedProperty) {
            return res.status(404).json({ 
                success: false,
                message: "Property not found" 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: "Property deleted successfully" 
        });

    } catch (error) {
        console.error("deleteProperty error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const changeStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const ALLOWED_STATUSES = ["Available", "Sold", "Pending Review", "Rejected"];

        if (!status) {
            return res.status(400).json({ 
                success: false,
                message: "Status field is required" 
            });
        }

        if (!ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(", ")}`
            });
        }

        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ 
                success: false,
                message: "Property not found" 
            });
        }

        property.status = status;
        await property.save();

        return res.status(200).json({
            success: true,
            message: "Status updated successfully",
            data: property
        });

    } catch (error) {
        console.error("changeStatus error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const addImage = async (req, res) => {
    try {
        const { id } = req.params;
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ 
                success: false,
                message: "Image data is required" 
            });
        }

        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ 
                success: false,
                message: "Property not found" 
            });
        }

        if (!property.images) {
            property.images = [];
        }
        
        property.images.push(image);
        await property.save();

        return res.status(200).json({
            success: true,
            message: "Image added successfully",
            data: property
        });

    } catch (error) {
        console.error("addImage error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

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

        if (propertyLocation) {
            filter.propertyLocation = {
                $regex: propertyLocation,
                $options: "i"
            };
        }

        if (propertyType) {
            filter.propertyType = propertyType;
        }

        if (status) {
            filter.status = status;
        }

        if (bedrooms) {
            filter.bedrooms = Number(bedrooms);
        }

        if (bathrooms) {
            filter.bathrooms = Number(bathrooms);
        }

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
            success: true,
            count: properties.length,
            data: properties
        });

    } catch (error) {
        console.error("searchProperties error:", error);
        return res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

const compareProperties = async (req, res) => {
    try {
        const [propA, propB] = await Promise.all([
            Property.findById(req.params.idA),
            Property.findById(req.params.idB),
        ]);

        if (!propA || !propB) {
            return res.status(404).json({ message: 'One or both properties not found' });
        }

        const result = propA.compareWith(propB);
        res.status(200).json({ data: result });

    } catch (error) {
        console.error("compareProperties error:", error);
        return res.status(500).json({ message: error.message });
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
    addImage,
    compareProperties
};
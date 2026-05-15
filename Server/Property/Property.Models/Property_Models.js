const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: true
    },
    propertyDescription: {
        type: String,
        required: true
    },
    propertyLocation: {
        type: String,
        required: true
    },
    propertyOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    propertyType: {
        type: String,
        required: true
    },
    propertyAmenities: [{
        type: String
    }],
    bedrooms: {
        type: Number,
        required: true
    },
    bathrooms: {
        type: Number,
        required: true
    },
    livingArea: {
        type: Number
    },
    assignedSales: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum:['Available','Sold','Pending Review','Rejected'],
        default: "Pending Review"
    },
    gardenArea: {
        type: Number,
        default: 0
    },
    roofArea: {
        type: Number,
        default: 0
    },
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer"
    }],
    rejectionReason:{
        type:String,
    }
}, { timestamps: true });

PropertySchema.methods.updateDetails = function(updatedProperty) {
    Object.assign(this, updatedProperty);
    return this.save();
};

PropertySchema.methods.changeStatus = function(newStatus) {
    this.status = newStatus;
    return this.save();
};

PropertySchema.methods.addImage = function(imageUrl) {
    this.images.push(imageUrl);
    return this.save();
};

module.exports = mongoose.model("Property", PropertySchema);
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
    price: {
        type: Number,
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
        enum: ['Apartment', 'Villa', 'Commercial', 'Land', 'Studio', 'Townhouse'],
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
        enum: ['Available', 'Sold', 'Pending Review', 'Rejected'],
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
    

    images: [{
        type: String  
    }],
    
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer"
    }],
    rejectionReason: {
        type: String,
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
    if (!this.images) {
        this.images = [];
    }
    this.images.push(imageUrl);
    return this.save();
};
PropertySchema.methods.compareWith = function(otherProperty) {
    const fields = [
        { key: 'propertyName',        label: 'Property Name' },
        { key: 'propertyType',        label: 'Type' },
        { key: 'propertyLocation',    label: 'Location' },
        { key: 'price',               label: 'Price' },
        { key: 'bedrooms',            label: 'Bedrooms' },
        { key: 'bathrooms',           label: 'Bathrooms' },
        { key: 'livingArea',          label: 'Living Area (m²)' },
        { key: 'gardenArea',          label: 'Garden Area (m²)' },
        { key: 'roofArea',            label: 'Roof Area (m²)' },
        { key: 'status',              label: 'Status' },
        { key: 'propertyDescription', label: 'Description' },
    ];

    const comparison = fields.map(({ key, label }) => {
        const valA = this[key];
        const valB = otherProperty[key];
        return {
            field: key,
            label,
            propertyA: valA ?? null,
            propertyB: valB ?? null,
            isDifferent: JSON.stringify(valA) !== JSON.stringify(valB),
        };
    });

    // Amenities handled separately since it's an array
    const amenitiesA = this.propertyAmenities ?? [];
    const amenitiesB = otherProperty.propertyAmenities ?? [];
    comparison.push({
        field: 'propertyAmenities',
        label: 'Amenities',
        propertyA: amenitiesA,
        propertyB: amenitiesB,
        isDifferent: JSON.stringify([...amenitiesA].sort()) !== JSON.stringify([...amenitiesB].sort()),
    });

    return {
        propertyA: { id: this._id, name: this.propertyName },
        propertyB: { id: otherProperty._id, name: otherProperty.propertyName },
        totalDifferences: comparison.filter(c => c.isDifferent).length,
        comparison,
    };
};

module.exports = mongoose.model("Property", PropertySchema);
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"]
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['buyer', 'owner', 'admin', 'sales', 'sales-agent'],
    default: 'buyer'
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property"
  }],
  phone: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    trim: true
  }
}, 
{ timestamps: true }

);

module.exports = mongoose.model("User", UserSchema);

const User = require('../../User/User.Model/User_Model');
const Property = require('../../Property/Property.Models/Property_Models');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

const createSalesAgent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Please write name , email and password"
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const salesAgent = await User.create({ name, email, password: hashedPassword, role: 'sales-agent' });
    res.status(201).send(salesAgent);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        if (!name || !email || !password) {
            return res.status(400).send({ message: "Please provide name, email, and password" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await User.create({ name, email, password: hashedPassword, role: 'admin' });
        res.status(201).send(admin);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).send({ message: "Please provide name, email, password, and role" });
    }

    if (!['buyer', 'owner'].includes(role)) {
      return res.status(400).send({ message: "Invalid role. Allowed values are buyer or owner." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).send({ message: "Property not found" });
    }
    res.status(200).send({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).send(properties);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
const getPendingProperties=async(req,res)=>{
  try{
    const properties=await Property.find({status:"Pending Review"})
    res.status(200).send(properties);
  }catch(error){
    res.status(500).send({message:error.message})
  }
};
const approveProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).send({ message: "Property not found" });

    property.status = req.body.status;

    if (req.body.rejectionReason) {
      property.rejectionReason = req.body.rejectionReason;
    }

    await property.save();
    res.status(200).send({ message: "Property updated successfully" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = { getAllUsers, getUserById, deleteUser, createSalesAgent, createAdmin, createUser, deleteProperty, getAllProperties,getPendingProperties,approveProperty };

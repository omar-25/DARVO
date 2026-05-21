const User = require('../User.Model/User_Model');
const bcrypt = require('bcrypt');

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const updateFields = {};
    if (req.body.name) updateFields.name = req.body.name;
    if (req.body.email) updateFields.email = req.body.email;
    if (req.body.role) updateFields.role = req.body.role;

    // If password is provided, hash it before updating
    if (req.body.password) {
      const hashed = await bcrypt.hash(req.body.password, 10);
      updateFields.password = hashed;
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).send({ message: 'No valid fields provided to update' });
    }

    const result = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).send({ message: 'User updated successfully', user: result });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await User.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
  updateUser,
  deleteUser
};
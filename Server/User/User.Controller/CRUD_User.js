const User = require('../User.Model/User_Model');

const updateUser = async (req, res) => {
  try {
     if (
         !req.body.name ||
         !req.body.description ||
         !req.body.price ||
         !req.body.quantity
     ) {
       return res.status(400).send({
         message: 'Send all required fields: name, description, price, quantity',
       });
     }
 
     const { id } = req.params;
 
     const result = await User.findByIdAndUpdate(id, req.body);
 
     if (!result) {
       return res.status(404).json({ message: 'User not found' });
     }
 
     return res.status(200).send({ message: 'User  updated successfully' });
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
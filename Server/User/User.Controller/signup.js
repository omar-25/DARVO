const User = require('../User.Model/User_Model');
const bcrypt = require("bcrypt");

const signup = async (req, res) => {

  try {

    const { name, email, password, role = 'buyer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        message: "Please write name, email and password"
      });
    }

    if (!['buyer', 'owner'].includes(role)) {
      return res.status(400).send({
        message: "Invalid role"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).send(user);

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = { signup };
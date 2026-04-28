const User = require("../Models/user");
const bcrypt = require("bcrypt");
const signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        message: "write name and email and password"
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).send(user);

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = { signup };
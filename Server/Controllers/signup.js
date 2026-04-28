const User = require("../Models/user");
const signup = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({
        message: "write name and email and password"
      });
    }

    const user = await User.create({ name, email, password });

    res.status(201).send(user);

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
module.exports = { signup };
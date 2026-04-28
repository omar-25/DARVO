const User = require("../Models/user");
const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).send({
        message: "Invalid email or password"
      });
    }

    res.status(200).send({
      message: "Login successfully"
    });

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

module.exports = { login };

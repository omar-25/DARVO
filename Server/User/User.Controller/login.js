const User = require("../User.Model/User_Model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Please fill all the required fields (email, password)" });
        }

        const existingUser = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
        const isPasswordValid = existingUser
            ? await bcrypt.compare(req.body.password, existingUser.password)
            : false;

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            {   userId: existingUser._id ,
                role: existingUser.role  
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const { password, ...userData } = existingUser.toObject();

        res.status(200).json({
            message: "Login successful",
            data: userData,
            token: token
        });

    } catch (error) {
        res.status(500).json({ message: "Failed to login", error: error.message });
    }
};
module.exports = { login };

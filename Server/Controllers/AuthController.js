import UserModel from '../Models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// register new users
export const registerUser = async (req, res) => {

    const { email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    let pass = password.toString();
    const hashedPass = await bcrypt.hash(pass, parseInt(salt));
    req.body.password = hashedPass;

    const newUser = new UserModel(req.body);


    try {

        const oldUser = await UserModel.findOne({ email });

        if (oldUser) {
            return res.status(400).json({ message: "This User already exists!" })
        }

        const user = await newUser.save();

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// Login users

export const loginUser = async (req, res) => {
    console.log("Backend: loginUser - Received data:", req.body);
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        if (user) {
            console.log("Backend: loginUser - User found:", user.email);
            console.log("Backend: loginUser - Comparing password...");

            const validity = await bcrypt.compare(password, user.password)
            console.log("Backend: loginUser - bcrypt.compare result:", validity);

            if (!validity) {
                res.status(400).json("Soory, Please enter the correct email or password!");
            } else {
                const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET);
                res.status(200).json({ user, token });
            }
        } else {
            res.status(404).json("Soory, Please enter the correct email or password!")
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
const UserModal = require('../models/User.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// const GetUserLogin = (req, res) => {
//     console.log("Request User", req.body);
//     try {

//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// }

const PostUserLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await UserModal.findOne({ email })

        if (!user) {
            return res.status(403).json({ message: 'Email & Password Wrong', success: false })
        }

        const IsPasswordEqual = await bcrypt.compare(password, user.password);

        if (!IsPasswordEqual) {
            return res.status(403).json({ message: 'Email & Password Wrong', success: false })
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(201).json({ message: 'Login Succesfully...', success: true, jwtToken, email: user.email, name: user.name })

    } catch (error) {
        console.log("Error----", error);

        res.status(500).json({ message: 'Server error', error });
    }
}

const PostUserSignIn = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModal.findOne({ email })
        console.log("Database query result for email:", email, user);
        if (user) {
            return res.status(409).json({ message: 'User already Exist You Can Login', success: false })
        }

        const userModel = new UserModal({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10)
        await userModel.save();
        res.status(201).json({
            message: 'User created successfully!',
            success: true,
            user: { name, email }, // Return necessary data
        })

    } catch (error) {
        console.log("Error__", error);

        res.status(500).json({ message: 'Server error' });
    }
}

// const GetUserSignIn = (req, res) => {
//     try {

//     } catch (error) {
//         res.status(500).json({ message: 'Server error' });
//     }
// }

module.exports = {  PostUserLogin, PostUserSignIn,  }
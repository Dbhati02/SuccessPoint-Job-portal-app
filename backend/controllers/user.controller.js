const User = require("../models/user-model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try {
        const { fullname, email, phone, password, role } = req.body;
  // Check for missing fields
        if (!fullname || !email || !phone || !password || !role) {
            return res.render('register', {
                message: 'All fields are required!',
                success: false
            });
        }
  // Check if the user already exists
        const user = await User.findOne({ email: email });
        if (user) {
            return res.render('register', {
                message: 'User already exists with this email.',
                success: false
            });
        }
  
        // Hash the password and create the user
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            fullname,
            email,
            phone,
            password: hashedPassword,
            role,
        });
  
        // Render success message or redirect
        return res.render('register', {
            message: 'Account created successfully!',
            success: true
        });
  
    } catch (error) {
        console.error(error.message);
        return res.render('register', {
            message: 'An error occurred during registration. Please try again later.',
            success: false
        });
    }
  };
  
  const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // Validate request body
        if (!email || !password || !role) {
            return res.render('login', {
                message: "All fields are required!",
                success: false
            });
        }

        // Check if user exists
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.render('login', {
                message: "Email or password is incorrect!",
                success: false
            });
        }

        // Verify password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.render('login', {
                message: "Email or password is incorrect!",
                success: false
            });
        }

        // Verify role
        if (role.toLowerCase() !== user.role.toLowerCase()) {
            return res.render('login', {
                message: "Account does not exist with the selected role!",
                success: false
            });
        }

        // Generate JWT token
        const tokenData = { userId: user._id };
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        // Set cookie
        res.cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
            httpOnly: true, // Prevents client-side scripts from accessing the cookie
            sameSite: 'strict', // Protects against CSRF
        });

        // Return success with user data
        const responseData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profile: user.profile,
        };

        return res.render('login', {
            message: `Welcome back, ${responseData.fullname}!`,
            success: true,
            user: responseData
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.render('login', {
            message: 'An internal error occurred. Please try again later.',
            success: false
        });
    }
};

 
 const logout = async (req, res) => {
    try {
        return res.status(200).clearCookie("token").redirect("/");
    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phone, bio, skills } = req.body;
        const file = req.file; // Assuming file upload is handled elsewhere
        const userId = req.id; // Middleware authentication to fetch userId

        if (!userId) {
            return res.render('editprofile', {
                message: 'Invalid user ID.',
                success: false,
                user: req.user
            });
        }

        let user = await User.findById(userId);
        if (!user) {
            return res.render('editprofile', {
                message: 'User not found.',
                success: false,
                user: req.user
            });
        }

        // Update only the fields provided in the request
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(","); // Convert comma-separated skills to an array

        // Save the updated user document
        await user.save();

        // Set success message and render
        return res.render('editprofile', {
            message: 'Profile updated successfully.',
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error(error.message);
        return res.render('editprofile', {
            message: 'An error occurred while updating the profile.',
            success: false,
            user: req.user
        });
    }
};



module.exports = {register, login,logout,updateProfile};
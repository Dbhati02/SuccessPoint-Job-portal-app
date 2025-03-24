const express = require('express');
const router = express.Router();
const {register,login,updateProfile,logout} = require("../controllers/user.controller");
const isAuthenticated = require("../middlewares/isAuthenticated");
const Company = require("../models/company-model")



router.post('/register', register);
router.get('/register', (req, res) => {
    res.render('register', {
        message: req.flash('message')[0]  // This will pass the entire message (either success or error)
    });
});

router.post('/login', (req, res) => {
    login(req, res); // Directly call the login function, as it handles the response internally
});
router.get('/login',(req,res) =>{
    res.render('login', {
        message: req.flash('message')[0]  // This will pass the entire message (either success or error)
    });
})

router.route("/logout").get(logout);

router.get('/profile', isAuthenticated, async (req, res) => {
    try {
        // Assuming `req.user` contains the authenticated user's data
        const user = req.user;

        // Extract nested profile details
        const { bio, skills, resume, resumeOriginalName, company: companyId, profilePhoto } = user.profile || {};
        const role = user.role;

        let companyDetails = null;

        // Fetch company details if companyId exists
        if (companyId) {
            companyDetails = await Company.findById(companyId).lean();
        }

        if (role === "student") {
            // Render the profile page for students
            res.render('profile', {
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                role: user.role,
                bio: bio || "Bio not provided", // Default if bio is missing
                skills: skills && skills.length > 0 ? skills : ["No skills added"], // Default if no skills
                resume: resume || null, // URL to the resume (null if not provided)
                resumeOriginalName: resumeOriginalName || "No resume uploaded", // Fallback for resume name
                profilePhoto: profilePhoto || '/images/placeholder.png'
            });
        } else if (role === "recruiter") {
            // Render the admin page for recruiters
            res.render('adminMain', {
                fullname: user.fullname,
                email: user.email,
                phone: user.phone,
                company: companyDetails || "No company associated", // Fetch and render full company details
                profilePhoto: profilePhoto || '/images/placeholder.png', // Fallback for profile photo
                message: "Welcome to the Admin Dashboard!", // Example of a custom message for recruiters
            });
        } else {
            // Handle cases where the role is not recognized
            res.status(403).send("Access Denied: Unrecognized Role");
        }

    } catch (error) {
        console.error("Error fetching profile:", error.message);
        res.status(500).send("An error occurred while fetching the profile.");
    }
});



router.route("/profile/update").post(isAuthenticated,updateProfile);
router.get('/profile/update',isAuthenticated,(req,res) =>{
    const user = req.user;
    res.render('editprofile', {
        message: req.flash('message')[0]  ,
        user
    });
})

module.exports = router;

const Company = require("../models/company-model");
const User = require("../models/user-model")


const registerCompany = async (req, res) => {
    try {
        const { name, description, website, location, logo } = req.body;

        // Check for missing fields
        if (!name || !description || !website || !location) {
            return res.render('registerCompany', {
                message: 'All fields are required!',
                success: false
            });
        }

        // Check if the recruiter already has a company
        const existingCompany = await Company.findOne({ userId: req.user._id });
        if (existingCompany) {
            return res.render('registerCompany', {
                message: 'You can only create one company!',
                success: false
            });
        }

        // Create the new company
        const company = new Company({
            name: name,
            description,
            website,
            location,
            logo:"/images/google.jpg",
            userId: req.user._id // Link the company to the recruiter
        });

        await company.save();
         // Update user profile to reference this company
        await User.findByIdAndUpdate(req.user._id, {
            $set: { "profile.company": company._id }
        });

        // Send success response
        return res.render('registerCompany', {
            message: 'Company created successfully!',
            success: true
        });

    } catch (error) {
        console.error("Error creating company:", error.message);
        return res.render('registerCompany', {
            message: 'An error occurred while creating the company. Please try again later.',
            success: false
        });
    }
};


const getCompany = async (req, res) => {
    try {
        const userId = req.id;//loggedin user id
        const companies = await Company.find({ userId });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            });
        }
        return res.status(200).json({
            companies,
            success: true
        });
    } catch (error) {
        console.log(error.message);

    }
}

const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);

        if (!company) {
            return res.status(404).render("errorPage", {
                message: "Company not found.",
                success: false
            });
        }
        return res.status(200).render("companyPage", {
            company,
            success: true
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).render("errorPage", {
            message: "An internal server error occurred.",
            success: false
        });
    }
};


const updateCompany = async (req, res) => {
    try {
        let { name, description, website, location } = req.body;
        const file = req.file;
        //cloudinary

        const updateData = { name, description, website, location };

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if(!company){
            return res.status(404).json({
                message: "Company not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true
        })

    } catch (error) {
console.log(error.message);

    }
}

module.exports = {registerCompany , getCompany , getCompanyById, updateCompany};
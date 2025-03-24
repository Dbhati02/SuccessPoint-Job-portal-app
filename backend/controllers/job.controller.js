const Job = require("../models/job-model");

//created jobs by admin 
const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experienceLevel, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experienceLevel || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel,
            position,
            company:companyId,
            created_by:userId
        })

        return res.status(201).json({
            message:"New job created successfully.",
            job,
            success:true
        })
    } catch (error) {
console.log(error.message);

    }
}

//for the students 
const getAllJobs = async (req, res) => {
    try {

        const keyword = req.query.keyword || ""; // To get the keyword for filter
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } }
            ]
        };

        // Fetch jobs from the database with filtering, sorting, and populating
        const jobs = await Job.find(query)
            .populate({
                path: "company",
                select: "name location website"
            })
            .sort({ createdAt: -1 });

        // If no jobs found, render the page with an empty jobs list and a message
        if (!jobs || jobs.length === 0) {
            return res.status(404).render("alljobs", {
                jobs: [],
                success: false,
                message: "No jobs found. Try refining your search!"
            });
        }

        // Render the alljobs.ejs page with the jobs data
        return res.status(200).render("alljobs", {
            jobs,
            success: true,
            message: null
        });
    } catch (error) {
        console.error("Error fetching jobs:", error.message);

        // Render an error page or pass the error message to the view
        return res.status(500).render("alljobs", {
            jobs: [],
            success: false,
            message: "An error occurred while fetching jobs. Please try again later."
        });
    }
};


//for student
const getJobById = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({
                message:"Job not found.",
                success:false
            })
        }

        return res.status(200).json({
            job,
            success:true
        })
    } catch (error) {
        console.log(error.message);
        
    }
}

//jobs created by admin 
const getAdminJobs = async (req,res)=>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({created_by:adminId});
        if(!jobs){
            return res.status(200).json({
                message:"Jobs are not found.",
                success:false
            })
        }
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {postJob, getAllJobs, getJobById, getAdminJobs};



git remote add origin https://github.com/Dbhati02/SuccessPoint-Job-portal-app.git


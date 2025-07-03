const express = require('express');
const isAuthenticated = require("../middlewares/isAuthenticated");
const Job = require("../models/job-model")
const User = require("../models/user-model")
const {postJob, getAllJobs, getJobById, getAdminJobs} = require("../controllers/job.controller");

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.get("/post", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const companyId = user?.profile?.company;

    if (!companyId) {
      return res.render("createJob", {
        message: "Please create a company first!",
        success: false,
        companyId: null
      });
    }

    res.render("createJob", {
      message: null,
      success: null,
      companyId
    });
  } catch (error) {
    console.log("Error loading createJob:", error.message);
    res.status(500).render("createJob", {
      message: "Server error",
      success: false,
      companyId: null
    });
  }
});



router.route("/get").get(isAuthenticated,getAllJobs);

router.route("/get/:id").post(isAuthenticated,getJobById);

//to get a job by name
router.get("/getjobbyname", async (req, res) => {
    try {
      const type = req.query;
      const query = type.q || ''; // Extract the 'q' parameter
   if (!query) {
        return res.status(400).json({ message: 'Search term is required' });
      }
      const jobs = await Job.find({
        $or: [
          { title: { $regex: query, $options: 'i' } }, // Case-insensitive regex search
        ],
      }).lean(); // Convert Mongoose documents to plain JavaScript objects
  
      if (jobs.length === 0) {
        return res.status(404).json({ message: 'No jobs found' });
      }
     
      res.render("jobsbyname", { jobs });

    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
router.route("/getadminjobs").get(isAuthenticated,getAdminJobs);

module.exports = router;
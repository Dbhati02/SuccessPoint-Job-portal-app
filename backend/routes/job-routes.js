const express = require('express');
const isAuthenticated = require("../middlewares/isAuthenticated");
const Job = require("../models/job-model")
const {postJob, getAllJobs, getJobById, getAdminJobs} = require("../controllers/job.controller");

const router = express.Router();

router.route("/post").post(isAuthenticated,postJob);
router.get("/post",isAuthenticated,(req,res)=>{
    res.render("createJob")
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
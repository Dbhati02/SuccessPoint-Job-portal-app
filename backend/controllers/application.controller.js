const Application = require("../models/application-model");
const Job = require("../models/job-model");

const applyJob = async (req, res) =>{
    try {
        const userId = req.id;
        const jobId = req.params.id;
      
            if (!jobId) {
                return res.status(400).json({
                    message: "Job ID is required",
                    success: false
                });
            }
        

        //check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });


        if(existingApplication){
            return res.status(400).json({
                message:"You have already applied for this job.",
                success:false
            })
        }

        //check if the job exits
        const job = await Job.findById(jobId); 
        if(!job){
            return res.status(404).json({
                message:"Job not found.",
                success:false
            })
        }

        //create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        })
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message:"Job applied successfully.",
            success:true
        })
    } catch (error) {
        console.log(error.message);
    }
}

const getAppliedJobs = async (req,res) =>{
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
            options:{sort:{createdAt:-1}}
            }
        });//this we have done to find all the applied jobs created at-1 , this will sort the applications in ascending order
        if(!application){
            return res.status(404).json({
                message:"No application.",
                success:false
            })
        };

        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error.message)
    }
}



//the user will see how many students have applied for the same job
const getApplied = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant',
           
            }
        });
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }

        return res.status(200).json({
            job,
            success:true
        })
    } catch (error) {
        console.log(error.message)
    }
}

const updateStatus = async (req,res) =>{
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:"Status is required",
                success:false
            })
        }

        //find the applocation by applocation id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"application not found",
                success:false
            })
        }

        //update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully",
            success:true
        })
        
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = {applyJob, getApplied, getAppliedJobs, updateStatus};
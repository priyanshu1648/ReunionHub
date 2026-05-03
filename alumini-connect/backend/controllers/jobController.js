const Job = require("../models/Job");

const getJobs = async (req, res) => {
  try {
    const search = req.query.search ? req.query.search.trim() : "";

    const filter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch jobs." });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email role"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch job details." });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, company, location, description, contactInfo } = req.body;

    if (!title || !company || !location || !description || !contactInfo) {
      return res.status(400).json({ message: "All job fields are required." });
    }

    const job = await Job.create({
      title,
      company,
      location,
      description,
      contactInfo,
      postedBy: req.user.id,
    });

    const populatedJob = await job.populate("postedBy", "name email role");

    res.status(201).json({
      message: "Job posted successfully.",
      job: populatedJob,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create job." });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
};

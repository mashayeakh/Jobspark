//this file contains of pic chart for both job seeker and recruiter.

const ActiveJobsModel = require("../../../Model/RecruiterModel/ActiveJobsModel");

// req - get - dashboard/skills-count
const getSkills = async (req, res) => {
    try {
        // Validate request if needed (e.g., check user permissions)
        // Example: if (!req.user || !req.user.isAdmin) return res.status(403).json({ status: 'fail', message: 'Unauthorized' });

        const activeJobs = await ActiveJobsModel.aggregate([
            {
                $match: {
                    status: "ongoing"
                }
            },
            {
                $project: {
                    skills: 1
                }
            }
        ]);

        if (!activeJobs || !Array.isArray(activeJobs)) {
            return res.status(404).json({ status: 'fail', message: 'No active jobs found' });
        }

        const skillsCount = {};

        activeJobs.forEach(job => {
            if (!job.skills || typeof job.skills !== 'string') return;
            const skills = job.skills.split(',').map(skill => skill.trim()).filter(Boolean);
            skills.forEach(skill => {
                if (skillsCount[skill]) {
                    skillsCount[skill]++;
                } else {
                    skillsCount[skill] = 1;
                }
            });
        });

        const totalActiveJobs = activeJobs.length;

        // Prepare the skills breakdown with percentages
        const skillsBreakdown = Object.keys(skillsCount).map(skill => {
            return {
                skill: skill,
                jobPostingsCount: skillsCount[skill],
                percentage: ((skillsCount[skill] / totalActiveJobs) * 100).toFixed(2)
            };
        });

        return res.status(200).json({ success: true, data: skillsBreakdown });
    } catch (error) {
        console.error("Error in getSkills:", error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
}

module.exports = { getSkills }
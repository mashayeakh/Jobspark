const UserModel = require("../../Model/AccountModel/UserModel");
const DEFAULT_AI_PASSWORD = "aipass123";

async function createUser(req, res) {
    try {
        const data = req.body;

        if (!data.role) {
            return res.status(400).json({ error: "Role is required" });
        }

        if (data.role === "recruiter") {
            if (!data.company_role || !data.website || !data.company_name) {
                return res.status(400).json({
                    error: "Company name, role and website are required for recruiters",
                });
            }

            data.recruiterProfile = {
                company_name: data.company_name,
                company_role: data.company_role,
                website: data.website,
            };

            // Cleanup recruiter from job_seeker fields
            delete data.company_role;
            delete data.website;
            delete data.jobSeekerProfile;
            delete data.skills;
            delete data.experienceLevel;
            delete data.appliedApplicationCount;
            delete data.appliedJobIds;
        }

        if (data.role === "job_seeker") {
            if (!Array.isArray(data.skills)) {
                return res.status(400).json({ error: "Skills array is required" });
            }

            if (!data.experienceLevel) {
                return res.status(400).json({ error: "Experience level is required" });
            }

            data.appliedApplicationCount = 0;
            data.appliedJobIds = [];
            data.jobSeekerProfile = data.jobSeekerProfile || {};

            // Cleanup job seeker from recruiter fields
            delete data.recruiterProfile;
            delete data.company_role;
            delete data.website;
        }

        const newUser = new UserModel(data);
        const result = await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            success: true,
            data: result,
        });
    } catch (err) {
        console.error("Error in createUser:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }
}


//! Patch method to insert a specific col in the existing user while logging.

// async function patchUser(req, res) {
//     try {
//         const exaistingEmail = req?.body?.email;
//         const currDate = req?.body?.currDate;
//         const jobId = req?.body?.jobId; // this should be sent from frontend only when applying
//         const isApplying = !!jobId;

//         if (!exaistingEmail) {
//             return res.status(404).json({
//                 error: "Email not found",
//                 success: false
//             });
//         }

//         const filter = { email: exaistingEmail };
//         const user = await UserModel.findOne(filter).select("+appliedJobIds +applicationAppliedCount");
//         console.log("USER ", user);

//         if (!user) {
//             return res.status(404).json({
//                 error: "User not found",
//                 success: false
//             });
//         }
//         // Handle password match
//         if (!user.isGeneratedByAI && !DEFAULT_AI_PASSWORD) {
//             return res.status(401).json({ error: "Invalid credentials", success: false });
//         }


//         // For AI users, check only if password matches the default one
//         if (user.isGeneratedByAI && !DEFAULT_AI_PASSWORD) {
//             return res.status(401).json({ error: "Invalid AI credentials", success: false });
//         }


//         // Build the update payload
//         const updateInfo = {
//             $set: {
//                 lastSignInTime: currDate,
//             }
//         };

//         // If user is job_seeker and applying to a job
//         if (isApplying && user.role === "job_seeker") {
//             if (!user.appliedJobIds.includes(jobId)) {
//                 updateInfo.$addToSet = { appliedJobIds: jobId };
//                 updateInfo.$inc = { applicationAppliedCount: 1 };
//             } else {
//                 return res.status(409).json({
//                     message: "User has already applied to this job",
//                     success: false
//                 });
//             }
//         }

//         // Final update
//         const updatedUser = await UserModel.findOneAndUpdate(filter, updateInfo, {
//             new: true,
//             select: "-appliedJobIds -applicationAppliedCount" // hide from response
//         });

//         return res.status(200).json({
//             message: "User updated successfully",
//             success: true,
//             data: updatedUser,
//         });

//     } catch (error) {
//         console.error("Error in patchUser:", error);
//         return res.status(500).json({
//             message: "Internal Server Error",
//             success: false,
//         });
//     }
// }

async function patchUser(req, res) {
    try {
        const exaistingEmail = req?.body?.email;
        const currDate = req?.body?.currDate;
        const jobId = req?.body?.jobId;
        const isApplying = !!jobId;
        const profileUpdate = req.body.update || {}; // optional

        if (!exaistingEmail) {
            return res.status(404).json({
                error: "Email not found",
                success: false
            });
        }

        const filter = { email: exaistingEmail };
        const user = await UserModel.findOne(filter).select("+appliedJobIds +applicationAppliedCount");
        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }

        if (!user.isGeneratedByAI && !DEFAULT_AI_PASSWORD) {
            return res.status(401).json({ error: "Invalid credentials", success: false });
        }

        // Build update payload
        const updateInfo = {
            $set: {
                lastSignInTime: currDate,
            },
        };

        // ✅ Add profile fields if provided
        if (profileUpdate.location) {
            updateInfo.$set.location = profileUpdate.location;
        }

        if (profileUpdate.jobSeekerProfile) {
            if (profileUpdate.jobSeekerProfile.preferredLocations) {
                updateInfo.$set["jobSeekerProfile.preferredLocations"] = profileUpdate.jobSeekerProfile.preferredLocations;
            }
            if (profileUpdate.jobSeekerProfile.university) {
                updateInfo.$set["jobSeekerProfile.university"] = profileUpdate.jobSeekerProfile.university;
            }
        }

        // ✅ Add job application logic if jobId exists
        if (isApplying && user.role === "job_seeker") {
            if (!user.appliedJobIds.includes(jobId)) {
                updateInfo.$addToSet = { appliedJobIds: jobId };
                updateInfo.$inc = { applicationAppliedCount: 1 };
            } else {
                return res.status(409).json({
                    message: "User has already applied to this job",
                    success: false
                });
            }
        }

        const updatedUser = await UserModel.findOneAndUpdate(filter, updateInfo, {
            new: true,
            select: "-appliedJobIds -applicationAppliedCount"
        });

        return res.status(200).json({
            message: "User updated successfully",
            success: true,
            data: updatedUser,
        });

    } catch (error) {
        console.error("Error in patchUser:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
}

const userProfileFromModel = async (req, res) => {
    try {
        const { email, ...updatedFields } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Find user document by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user fields
        Object.keys(updatedFields).forEach((key) => {
            user[key] = updatedFields[key];
        });

        // Save updated document
        const updatedUser = await user.save();

        return res.status(200).json({
            success: true,
            message: "User profile updated successfully",
            data: updatedUser,
        });
    } catch (err) {
        console.error("Error updating user profile:", err);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
    }
}


//! find by email
async function findUserByEmail(req, res) {
    //get the email
    const email = req?.query?.email;

    try {
        //get the user by email
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        const role = user?.role;
        console.log("User role:", role);
        res.status(200).json({
            success: true,
            data: user,
        })

    } catch (err) {
        console.error("Error in findUserByEmail:", err);
        res.status(500).json({ message: "Something went wrong", error: err.message });
    }


}

module.exports = { createUser, patchUser, findUserByEmail, userProfileFromModel }
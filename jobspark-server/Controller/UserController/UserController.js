const UserModel = require("../../Model/AccountModel/UserModel");

async function createUser(req, res) {

    try {
        const data = req.body;
        console.log("Data received:", data);
        console.log("Received role:", req.query.role); // or req.params.role if using route param
        //specifing the role
        if (!data.role) {
            res.status(400).json({
                error: "Role is required",
            })
        }

        if (data.role === "recruiter" && (!data.company_role || !data.website)) {
            return res.status(400).json({
                error: "Company role and website are required for recruiters",
            });
        }

        const newUser = new UserModel(data);
        const result = await newUser.save();

        console.log("Result:", result);
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

async function patchUser(req, res) {
    try {
        const exaistingEmail = req?.body?.email;
        const currDate = req?.body?.currDate;
        const jobId = req?.body?.jobId; // this should be sent from frontend only when applying
        const isApplying = !!jobId;

        if (!exaistingEmail) {
            return res.status(404).json({
                error: "Email not found",
                success: false
            });
        }

        const filter = { email: exaistingEmail };
        const user = await UserModel.findOne(filter).select("+appliedJobIds +applicationAppliedCount");

        if (!user) {
            return res.status(404).json({
                error: "User not found",
                success: false
            });
        }

        // Build the update payload
        const updateInfo = {
            $set: {
                lastSignInTime: currDate,
            }
        };

        // If user is job_seeker and applying to a job
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

        // Final update
        const updatedUser = await UserModel.findOneAndUpdate(filter, updateInfo, {
            new: true,
            select: "-appliedJobIds -applicationAppliedCount" // hide from response
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
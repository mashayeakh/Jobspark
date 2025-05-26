const UserModel = require("../Model/AccountModel/UserModel");

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
    //grab the exisitng email
    const existingEmail = req?.body?.email;
    console.log("Existing email.", existingEmail);

    //if not existed
    if (!existingEmail) {
        res.status(404).json({
            error: "email not found",
        })
    }

    //if existed - mathing the exiting email
    const filter = { email: existingEmail };

    //add a specific col 
    const updateInfo = {
        $set: {
            lastSignInTime: req?.body?.currDate,
        }
    };

    const result = await UserModel.findOneAndUpdate(filter, updateInfo, { new: true });

    res.status(200).json({
        message: "User updated successfully",
        success: true,
        data: result,
    });
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

module.exports = { createUser, patchUser, findUserByEmail }
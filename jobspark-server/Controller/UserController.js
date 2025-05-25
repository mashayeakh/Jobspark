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

module.exports = { createUser }
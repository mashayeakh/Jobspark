const bcrypt = require('bcryptjs');  // For password hashing
const AdminModel = require('../../../Model/AccountModel/AdminModel');

const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin instance
        const newAdmin = new AdminModel({
            name,
            email,
            password: hashedPassword,
        });

        // Save to the database
        await newAdmin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: 'Error creating admin' });
    }
};

module.exports = { createAdmin }
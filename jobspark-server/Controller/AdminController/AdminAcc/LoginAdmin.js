const bcrypt = require('bcryptjs');
// const Admin = require('../models/Admin');
const AdminModel = require('../../../Model/AccountModel/AdminModel');
const session = require('express-session');

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the admin by email
        const admin = await AdminModel.findOne({ email });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Compare the password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Store the admin ID in session (if using session-based auth)
        req.session.adminId = admin._id;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            admin: {
                _id: admin._id,
                email: admin.email,
                name: admin.name
            }
        });

    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { loginAdmin }
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const session = require('express-session');
const crypto = require('crypto');
const cron = require("node-cron");

dotenv.config();  // Load environment variables

// Middleware to parse JSON request bodies
app.use(express.json());
// app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

const secretKey = process.env.SESSION_SECRET_KEY;  // Load from .env file

app.use(session({
    secret: secretKey, // A secret key for encryption
    resave: false,             // Forces the session to be saved even if it wasn't modified
    saveUninitialized: false,   // Save uninitialized session
    cookie: {
        // Make sure cookie is set correctly for localhost
        secure: false,    // secure: true only for https
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    }  // Set to true if using HTTPS
}));

const fetchIncompleteProfiles = require("./Utils/fectchIncompleteProfiles");
const { processProfileIncompleteNotifications } = require("./Utils/profileReminderService");

// MongoDB connection setup
// testFetch.js

// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(async () => {
//     console.log("✅ Connected to MongoDB");

//     // const result = await fetchIncompleteProfiles();
//     // console.log("🧠 Users to warn ➤", result.map(r => r.user.email));

//     // await processProfileIncompleteNotifications();
//     // console.log("✅ Done processing profile reminders.");

//     // await mongoose.disconnect();
//     // console.log("🔌 Disconnected from MongoDB");
// }).catch(err => {
//     console.error("❌ MongoDB connection error:", err);
// });

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("✅ Connected to MongoDB");
}).catch(err => {
    console.error("❌ MongoDB connection error:", err);
});


// Set the port from environment or default to 5000
const port = process.env.PORT || 5000;

// Import Routes
const userRoutes = require('./Routes/UserRouter/UserRoutes');
const recruiterJobsRoutes = require("./Routes/RecruiterJobsRouter/RecruiterJobsRouter");
const activeJobsRoutes = require("./Routes/ActiveJobsRecruiter/ActiveJobsRouter");
const jobApplicationRoutes = require("./Routes/JobApplicationRecruiter/JobApplicationRecruiter");
const recruiterActivityRoutes = require("./Routes/RecruiterJobsRouter/RecruiterActivityRouter");
const interviewRoutes = require("./Routes/RecruiterJobsRouter/InterviewRoute");
const notificationRoutes = require("./Routes/NotificationRouter/NotificationRouter");
const companyRoutes = require("./Routes/CompanyRouter/CompanyRouter");
const filterRoutes = require("./Routes/FilterRouter/FilterRouter");
const networkRoutes = require("./Routes/NetworkRouter/NetworkRouter");
const aiRoutes = require("./Routes/AiBasedRouter/AiJobsRouter");
const appliationOverTimeGraphs = require("./Routes/ApplicationGraphRouter/ApplicationOverTime");
const appliationsPerJobs = require("./Routes/ApplicationGraphRouter/ApplicationsPerJobs");
const exportingActiveJobs = require("./Routes/ExportRoutes/ExportActiveJobsRouter");
const exportingTotalApplication = require("./Routes/ExportRoutes/ExportTotalApplicationRouter");
const exportingAnalyticsData = require("./Routes/ExportRoutes/ExportAnalyticsDataRouter");
const admin_dashboardStats = require("./Routes/AdminRouter/Admin_DashboardRoute");
const jobSeekerActivityBar = require("./Routes/AdminRouter/Admin_DashboardGraphs/JobSeekerRouter");
const recruiterActivityBar = require("./Routes/AdminRouter/Admin_DashboardGraphs/RecruiterRouter");
const piechartDashboard = require("./Routes/AdminRouter/Admin_DashboardGraphs/PiChatRouter");
const jobSeeker_Dashboard = require("./Routes/AdminRouter/Manage/JobSeeker_DashboardRouter/JobSeeker_DashboardRouter");
const jobSeeker_activeProfile = require("./Routes/AdminRouter/Manage/JobSeeker_DashboardRouter/JobSeeker_ActiveProfileRouter");
const suspended_jobSeeker = require("./Routes/AdminRouter/Manage/JobSeeker_DashboardRouter/Suspended_JobSeeker");
const adminNotification = require("./Routes/NotificationRouter/AdminNotificationRouter");
const createAdmin = require("./Routes/AdminRouter/AdminAcc");
const verifiedJobSeeker = require("./Routes/AdminRouter/Manage/JobSeeker_DashboardRouter/JobSeeker_VerifiedRouter");
const jobSeekerSearch = require("./Routes/AdminRouter/Manage/JobSeeker_DashboardRouter/JobSeeker_SearchingRouter");

const jobSeekerActivity = require("./Routes/AdminRouter/Manage/JobSeeker_DashboardRouter/JobSeeker_ActivityRouter");





// const fetchIncompleteProfiles = require("./Utils/fectchIncompleteProfiles");

// cron.schedule("* * * * *", async () => {
//     console.log("⏰ Running daily profile warning reminder...");
//     try {
//         // await processProfileIncompleteNotifications();
//         console.log("✅ Done sending profile warnings");
//     } catch (err) {
//         console.error("❌ Error in profile reminder job:", err.message);
//     }
// });



// Cron job for job expiration check every hour
cron.schedule("0 * * * *", () => {
    console.log("⏰ Running job expiration check...");
    expireOldJobs();
});

// Function to expire old jobs (you must define this function somewhere)
const expireOldJobs = () => {
    console.log("Expiring old jobs...");

};

// Testing route to check server
app.get("/test", async (req, res) => {
    res.send("Hello world");
});

// Routes
app.use('/api/v1', userRoutes);
app.use("/api/v1", recruiterJobsRoutes);
app.use("/api/v1", activeJobsRoutes);
app.use("/api/v1", jobApplicationRoutes);
app.use("/api/v1", recruiterActivityRoutes);
app.use("/api/v1", interviewRoutes);
app.use("/api/v1", notificationRoutes);
app.use("/api/v1", companyRoutes);
app.use("/api/v1", filterRoutes);
app.use("/api/v1/network", networkRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/graphs", appliationOverTimeGraphs);
app.use("/api/v1/graphs", appliationsPerJobs);
app.use("/api/v1/export", exportingActiveJobs);
app.use("/api/v1/export", exportingTotalApplication);
app.use("/api/v1/export", exportingAnalyticsData);

// Admin Routes
app.use("/api/v1/admin", admin_dashboardStats);
app.use("/api/v1/admin", jobSeekerActivityBar);
app.use("/api/v1/admin", recruiterActivityBar);
app.use("/api/v1/admin", piechartDashboard);
app.use("/api/v1/admin", createAdmin);
app.use("/api/v1/admin", jobSeeker_Dashboard);
app.use("/api/v1/admin", jobSeeker_activeProfile);
app.use("/api/v1/admin", suspended_jobSeeker);
app.use("/api/v1/admin", adminNotification);
app.use("/api/v1/admin", verifiedJobSeeker);
app.use("/api/v1/admin", jobSeekerSearch);
app.use("/api/v1/admin", jobSeekerActivity);

// Starting the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

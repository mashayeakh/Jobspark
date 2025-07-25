const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const port = process.env.Port || 5000;
const cron = require("node-cron");

// const routes = require("./Routes/TestRoutes");
// const testRoutes = require('./Routes/TestRoutes');
const userRoutes = require('./Routes/UserRouter/UserRoutes');


const activeJobsRoutes = require("./Routes/ActiveJobsRecruiter/ActiveJobsRouter");

const recruiterJobsRoutes = require("./Routes/RecruiterJobsRouter/RecruiterJobsRouter");

const jobApplicationRoutes = require("./Routes/JobApplicationRecruiter/JobApplicationRecruiter");

const recruiterActivityRoutes = require("./Routes/RecruiterJobsRouter/RecruiterActivityRouter");

const interviewRoutes = require("./Routes/RecruiterJobsRouter/InterviewRoute")

const notificationRoutes = require("./Routes/NotificationRouter/NotificationRouter")

const companyRoutes = require("./Routes/CompanyRouter/CompanyRouter");

const filterRoutes = require("./Routes/FilterRouter/FilterRouter");

const networkRoutes = require("./Routes/NetworkRouter/NetworkRouter");

const aiRoutes = require("./Routes/AiBasedRouter/AiJobsRouter");

const appliationOverTimeGraphs = require("./Routes/ApplicationGraphRouter/ApplicationOverTime")

const appliationsPerJobs = require("./Routes/ApplicationGraphRouter/ApplicationsPerJobs")

const exportingActiveJobs = require("./Routes/ExportRoutes/ExportActiveJobsRouter");

const exportingTotalApplication = require("./Routes/ExportRoutes/ExportTotalApplicationRouter");

const exportingAnalyticsData = require("./Routes/ExportRoutes/ExportAnalyticsDataRouter");

const admin_dashboardStats = require("./Routes/AdminRouter/Admin_DashboardRoute");

const jobSeekerActivityBar = require("./Routes/AdminRouter/Admin_DashboardGraphs/JobSeekerRouter");

const recruiterActivityBar = require("./Routes/AdminRouter/Admin_DashboardGraphs/RecruiterRouter");

const { default: mongoose } = require("mongoose");
const { expireOldJobs } = require("./Controller/RecruiterController/RecruiterJobsController");


cron.schedule("0 * * * *", () => {
    console.log("⏰ Running job expiration check...");
    expireOldJobs();
});
expireOldJobs();

app.use(express.json());
app.use(cors());

dotenv.config();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    // useUnifiedTopology: true
})

app.get("/test", async (req, res) => {
    res.send("Hello world");
});

// app.use('/api/v1', testRoutes);
app.use('/api/v1', userRoutes);
app.use("/api/v1", recruiterJobsRoutes); //changed the order
app.use("/api/v1", activeJobsRoutes);
app.use("/api/v1", jobApplicationRoutes);
app.use("/api/v1", recruiterActivityRoutes);
app.use("/api/v1", interviewRoutes);
app.use("/api/v1", notificationRoutes);

//company profile 
app.use("/api/v1", companyRoutes);

app.use("/api/v1", filterRoutes);



//Gemini api
app.use("/api/v1/network", networkRoutes);
app.use("/api/v1/ai", aiRoutes);


//application graphs
app.use("/api/v1/graphs", appliationOverTimeGraphs);
app.use("/api/v1/graphs", appliationsPerJobs);

//exporting 
app.use("/api/v1/export", exportingActiveJobs);
app.use("/api/v1/export", exportingTotalApplication);
app.use("/api/v1/export", exportingAnalyticsData);

//admin
// dashboard 
app.use("/api/v1/admin", admin_dashboardStats);
app.use("/api/v1/admin", jobSeekerActivityBar);
app.use("/api/v1/admin", recruiterActivityBar);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
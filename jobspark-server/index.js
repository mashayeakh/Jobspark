const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const port = process.env.Port || 5000;
// const routes = require("./Routes/TestRoutes");
// const testRoutes = require('./Routes/TestRoutes');
const userRoutes = require('./Routes/UserRouter/UserRoutes');
const activeJobsRoutes = require("./Routes/ActiveJobsRecruiter/ActiveJobsRouter");
const recruiterJobsRoutes = require("./Routes/RecruiterJobsRouter/RecruiterJobsRouter");
const jobApplicationRoutes = require("./Routes/JobApplicationRecruiter/JobApplicationRecruiter");

const recruiterActivityRoutes = require("./Routes/RecruiterJobsRouter/RecruiterActivityRouter");
const { default: mongoose } = require("mongoose");


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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
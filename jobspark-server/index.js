const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const port = process.env.Port || 5000;
// const routes = require("./Routes/TestRoutes");
// const testRoutes = require('./Routes/TestRoutes');
const userRoutes = require('./Routes/UserRoutes');
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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
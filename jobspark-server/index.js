const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.Port || 5000;
// const routes = require("./Routes/TestRoutes");
const testRoutes = require('./Routes/TestRoutes');


app.use(express.json());
app.use(cors());

app.get("/test", async (req, res) => {
    res.send("Hello world");
});



app.use('/api/v1', testRoutes); // So your route is: /api/v1/test



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
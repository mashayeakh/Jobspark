const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.Port || 5000;

app.use(express.json());
app.use(cors());

app.get("/test", async (req, res) => {
    res.send("Hello world");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
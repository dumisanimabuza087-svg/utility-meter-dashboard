const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

let meters = [];

// Get all meter readings
app.get("/meters", (req, res) => {
    res.json(meters);
});

// Add new meter reading
app.post("/meters", (req, res) => {

    const meter = {
        id: meters.length + 1,
        meterId: req.body.meterId,
        previous: req.body.previous,
        current: req.body.current
    };

    meter.usage = meter.current - meter.previous;

    meters.push(meter);

    res.json(meter);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
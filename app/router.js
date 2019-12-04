const express = require("express");
const genLogs = require("./genLogs");

const router = express.Router();

router.post("/diff", async function(req, res) {
    const { oldSpec, newSpec, location } = req.body;

    const data = await genLogs(oldSpec, newSpec, location);

    res.status(200).json(data);
});

module.exports = router;

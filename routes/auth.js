const express = require('express');
const app = express();
const { register, login, resetPassword } = require("../controller/authcontrol")

app.post("/register", async(req,res) => {
    console.log('Received registration request:', req.body);
    const user = req.body;
    const result = await register(user);
    res.json(result);
});

app.post("/login", async (req, res) => {
    console.log('Received login request:', req.body);
    const user = req.body;
    const result = await login(user);
    res.json(result);
});

// Reset Password route (requires email + oldPassword + newPassword)
app.post("/reset-password", async (req, res) => {
    console.log('Received reset password request:', req.body);
    const result = await resetPassword(req.body);
    res.json(result);
});

module.exports = app
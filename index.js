const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require('./dbConnect');
const cors = require('cors');

const app = express();
dotenv.config();
dbConnect();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", require('./routes/auth'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
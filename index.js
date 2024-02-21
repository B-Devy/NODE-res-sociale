const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoute = require('./routes/auth.js');
const postRoute = require('./routes/posts')
const userRoute = require('./routes/users')

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());

// all API Routes
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/users", userRoute);

// Connect with MongoDB Database
mongoose.connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Connection is successfull.")
}).catch((err) => {
    console.log(err.message);
})

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})







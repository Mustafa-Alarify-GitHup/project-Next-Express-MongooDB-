const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// middlewares
const { errorHandler, notFouned } = require("./middlewares/ConstMiddlewares")


app = express();
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded({ extended: true, }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URL + process.env.NAME_DATABASE)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT, () => {
            console.log("Start Server in Port :\t" + process.env.PORT)
        });
    })
    .catch((error) => {
        console.error('====================================');
        console.error('Error connecting to MongoDB:', error);
        console.error('====================================');
    });


//   Routes
app.use("/api/auth/", require("./Controllers/AuthControllers"));
app.use("/api/users/", require("./Controllers/UsersControllers"));
app.use("/api/post/", require("./Controllers/PostsController"));
app.use("/api/comment/",require("./Controllers/CommentsControolers"))

app.use(notFouned);
app.use(errorHandler);

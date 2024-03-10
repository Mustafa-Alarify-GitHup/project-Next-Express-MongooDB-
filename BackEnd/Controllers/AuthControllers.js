const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Import Model
const {
  Users,
  Vailedata_Sign_Users,
  Vailedata_Login_Users,
} = require("../models/users");

/**---------------------------------------------
 * @dec    Sign up 
 * @route  /api/auth/sign_up
 * @method post
 * @access public
 --------------------------------------------------*/
route.post("/sign_up", async (req, res) => {
  try {
    console.log(req.body);
    const { error } = Vailedata_Sign_Users(req.body);
    if (error) {
      return res.status(255).json({ message: error.details[0].message });
    }
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
      return res.status(200).json({ message: "User is already exist" });
    }
    if (req.body.password && req.body.username && req.body.email) {
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash(req.body.password, salt);

      const newUser = await new Users({
        username: req.body.username,
        email: req.body.email,
        password: hashed_password,
      }).save();
      // Make Token
      const token = jwt.sign(
        {
          id: newUser._id,
          isAdmin: newUser.isAdmin,
        },
        process.env.SCRIPT_key,
        { expiresIn: "30m" }
      );
      return res.status(201).json({ message: "Sign up is successful", token });
    } else {
      return res.status(255).json({ message: "Plz full All Data" });
    }
  } catch (e) {
    return res.status(255).json({ message: `The Error ${e}` });
  }
});

/**---------------------------------------------
 * @dec    Login 
 * @route  /api/auth/Login
 * @method post
 * @access public
 --------------------------------------------------*/
route.post("/Login", async (req, res) => {
  try {
    // validation
    const { error } = Vailedata_Login_Users(req.body);
    if (error) {
      return res
        .status(200)
        .json({ message: error.details[0].message, status: "400" });
    }
    // Login Users
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
      const isPassword = await bcrypt.compare(req.body.password, user.password);
      if (isPassword) {
        const token = user.generateAuthToken();
        return res.status(200).json({
          status: "successfully",
          Admin: user.isAdmin,
          id: user._id,
          Token: token,
        });
      } else {
        return res.status(255).json({
          message: "The  Password Is Failed !",
          status: "400",
        });
      }
    } else {
      return res
        .status(255)
        .json({ message: "The Email Is Failed !", status: "400" });
    }
    // Error In Connected Server
  } catch (E) {
    return res
      .status(255)
      .json({ message: `The Error => ${E}`, status: "400" });
  }
});
module.exports = route;

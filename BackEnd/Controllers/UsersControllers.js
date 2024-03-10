const express = require("express");
const route = express.Router();
const bcrypt = require("bcryptjs");
const { Users, Vailedata_Updata_Users } = require("../models/users");
const { Verfy_Token } = require("../middlewares/Verfy_Token");
const { Verfy_Token_user } = require("../middlewares/Verfy_token_user");
const { Verfy_Decoded_Token } = require("../middlewares/Verfiy_Decoded_Token");
const photoUpload = require("../middlewares/Upload_img");
const {
  Verfy_Token_Admin_User,
} = require("../middlewares/Verfy_Token_Admin_User");
const { Posts } = require("../models/Post_model");
const { Comments } = require("../models/Comments_Model");

/**---------------------------------------------
 * @dec    Get All users
 * @route  /api/users/Get_All_users
 * @method Gey
 * @access private  (only admin)
 --------------------------------------------------*/
route.get("/Get_All_users", Verfy_Token, async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const users = await Users.find();
      return res.status(200).json({ Data: users });
    } else {
      return res.status(403).json({ message: "You isn`t Admin!" });
    }
  } catch (E) {
    return res.status(200).json({ message: `The Error ${E}` });
  }
});

/**---------------------------------------------
 * @dec    Get user by id
 * @route  /api/users/Get_All_users/:ID
 * @method Get
 * @access public
 --------------------------------------------------*/
route.get("/Get_One_user/",Verfy_Decoded_Token,async (req, res) => {
  try {
    const id =req.user.id;
    const user = await Users.findById(id).select("-password");
    const posts = await Posts.find({ user: id});
    if (user) {
      console.log(user)
      return res.status(200).json({ data: user, Posts: posts,status:"successfully" });
    } else {
      return res.status(200).json({ message: "Not Found This User" });
    }
  } catch (E) {
    return res.status(200).json({ message: `The Error ${E}` });
  }
});

/**---------------------------------------------
 * @dec    Update user 
 * @route  /api/users/updata_user/:ID
 * @method put
 * @access private  (only user himself)
 --------------------------------------------------*/
route.put("/updata_user/:ID", Verfy_Token_user, async (req, res) => {
  try {
    const { error } = Vailedata_Updata_Users(req.body);
    if (error) {
      return res.status(200).json({ message: error.details[0].message });
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      return (req.body.password = await bcrypt.hash(req.body.password, salt));
    }

    const newUser = await Users.findByIdAndUpdate(req.params.ID, {
      $set: {
        username: req.body.username,
        password: req.body.password,
      },
    });
    return res
      .status(200)
      .json({ message: "Updata is Sueecssfuly", Data: newUser });
  } catch (E) {
    return res.status(200).json({ message: "E" });
  }
});

/**---------------------------------------------
 * @dec    GET User Count
 * @route  /api/users/Count
 * @method Get
 * @access private  (only admin)
 --------------------------------------------------*/
route.get("/Count", Verfy_Token, async (req, res) => {
  try {
    const count_users = await Users.countDocuments();
    return res.status(200).json({ count: count_users });
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

/**---------------------------------------------
 * @dec    Upload Image
 * @route  /api/users/Upload-Image
 * @method post
 * @access private  (only user himself)
 --------------------------------------------------*/
route.post("/Upload-Image", photoUpload.single("image"), async (req, res) => {
  if (req.file) {
    return res.status(200).json({ messgae: "Uplode img is Sueecssfuly" });
  } else {
    return res.status(200).json({ messgae: "ssssssssss s s s" });
  }
});

/**---------------------------------------------
 * @dec    Delete user profile
 * @route  /api/users/delete_user
 * @method Delete
 * @access private  (only admin or user himself)
 --------------------------------------------------*/
route.delete("/delete_user/:ID", Verfy_Token_Admin_User, async (req, res) => {
  try {
    const user = await Users.findById(req.params.ID);
    if (user) {
      // Delete user
      await Users.findByIdAndDelete(req.params.ID);

      // Delete user posts
      await Posts.deleteMany({ user: req.params.ID });

      // Delete comments
      await Comments.deleteMany({ user_id: req.params.ID });

      return res.status(200).json({ message: "The Delete is Sueecssfuly" });
    } else {
      return res.status(404).json({ message: "This User is not Defound" });
    }
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

module.exports = route;

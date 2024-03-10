const express = require("express");
const route = express.Router();
const {
  Posts,
  Vailedata_Add_post,
  Vailedata_Updata_post,
} = require("../models/Post_model");
const { Verfy_Decoded_Token } = require("../middlewares/Verfiy_Decoded_Token");
const { Comments } = require("../models/Comments_Model");

/**---------------------------------------------
 * @dec    Craet New Post
 * @route  /api/post/Add
 * @method Post
 * @access private  (only user himself)
 --------------------------------------------------*/
route.post("/Add", Verfy_Decoded_Token, async (req, res) => {
  // Validatation For Request
  try {
    const { error } = Vailedata_Add_post(req.body);
    if (error) {
      return res.status(200).json({ message: error.details[0].message });
    }
    // Add New Post
    await new Posts({
      title: req.body.title,
      body: req.body.body,
      user: req.user.id,
      category: req.body.category,
    }).save();
    return res.status(201).json({ message: "The Created is Successfuly" });
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

/**---------------------------------------------
 * @dec    Get All Posts
 * @route  /api/post/
 * @method Get
 * @access public 
 --------------------------------------------------*/
route.get("/", async (req, res) => {
  try {
    const number_posts = 4;
    const { cat, page_number } = req.query;
    if (cat) {
      const posts = await Posts.find({ category: cat }).sort({ createdAt: -1 });
      return res.status(200).json({ data: posts });
    } else if (page_number) {
      const posts = await Posts.find()
        .skip((page_number - 1) * number_posts)
        .limit(number_posts)
        .sort({ createdAt: -1 });
      return res.status(200).json({ data: posts });
    } else {
      const posts = await Posts.find().sort({ createdAt: -1 });
      return res.status(200).json({ data: posts });
    }
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

/**---------------------------------------------
 * @dec    Get Count posts
 * @route  /api/post/Count
 * @method Get
 * @access public 
 --------------------------------------------------*/
route.get("/count", async (req, res) => {
  try {
    const Count = await Posts.countDocuments();
    return res.status(200).json({ data: Count });
  } catch (E) {
    return res.status(200).json({ message: E.message });
  }
});

/**---------------------------------------------
 * @dec    Get One Post by Id
 * @route  /api/post/:is
 * @method Get
 * @access public 
 --------------------------------------------------*/
route.get("/:ID", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.ID);
    if (post) {
      return res.status(200).json({ data: post });
    } else {
      return res.status(200).json({ message: "Not found This post" });
    }
  } catch (E) {
    return res.status(200).json({ message: E.message });
  }
});

/**---------------------------------------------
 * @dec    Delete post
 * @route  /api/post/delete/:ID
 * @method Delete
 * @access private (only admin or user himself) 
 --------------------------------------------------*/
route.delete("/delete/:ID", Verfy_Decoded_Token, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.ID);
    if (post) {
      if (req.user.isAdmin || post.user === req.user.id) {
        await Posts.findByIdAndDelete(req.params.ID);
        await Comments.deleteMany({ post_id: req.params.ID });
        return res.status(200).json({ message: "The Delete is Sueesccfuly" });
      } else {
        return res
          .status(200)
          .json({ message: "You Connot delete this post " });
      }
    } else {
      return res.status(200).json({ message: "This post is not found" });
    }
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

/**---------------------------------------------
 * @dec    Updata post
 * @route  /api/post/updata/:ID
 * @method put
 * @access private (only user himself) 
 --------------------------------------------------*/
route.put("/updata/:ID", Verfy_Decoded_Token, async (req, res) => {
  try {
    const post = await Posts.findById(req.params.ID);
    if (post) {
      if (post.user === req.user.id) {
        const { error } = await Vailedata_Updata_post(req.body);
        if (error) {
          res.status(200).json({ message: error.details[0].message });
        } else {
          await Posts.findByIdAndUpdate(req.params.ID, {
            title: req.body.title,
            body: req.body.body,
            category: req.body.category,
          });
          return res
            .status(200)
            .json({ message: "The Updata is Sueesccfuly", status: 200 });
        }
      } else {
        return res
          .status(200)
          .json({ message: "You Connot Updata this post " });
      }
    } else {
      return res.status(200).json({ message: "This post is not found !" });
    }
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

/**---------------------------------------------
 * @dec    Toggle Like
 * @route  /api/post/like/:ID
 * @method put
 * @access private (only user himself) 
 --------------------------------------------------*/
route.put("/like/:ID", Verfy_Decoded_Token, async (req, res) => {
  try {
    if (req.user.id) {
      const post = await Posts.findById(req.params.ID);
      if (post) {
        const isAlreadyLiked = post.likes.find((user) => user === req.user.id);

        // Add Like
        if (!isAlreadyLiked) {
          await Posts.findByIdAndUpdate(req.params.ID, {
            $push: { likes: req.user.id },
          });
          return res.status(200).json({ message: "Add Like !" });
        }
        // Remove Like
        else {
          await Posts.findByIdAndUpdate(req.params.ID, {
            $pull: { likes: req.user.id },
          });
          return res.status(200).json({ message: "Remove Like !" });
        }
      } else {
        return res.status(200).json({ message: "This post isnot found !" });
      }
    }
  } catch (E) {
    return res.status(200).json({ message: `The Erroe :${E}` });
  }
});

module.exports = route;

const express = require("express");
const { Vailedata_Add_Comment, Comments } = require("../models/Comments_Model");
const { Verfy_Token } = require("../middlewares/Verfy_Token");
const { Verfy_Decoded_Token } = require("../middlewares/Verfiy_Decoded_Token");
const { Vailedata_Updata_post } = require("../models/Post_model");
const { date } = require("joi");
const route = express.Router();

/**---------------------------------------------
 * @dec    Create New Comment
 * @route  /api/comment/add
 * @method Post
 * @access private  (only user himself)
 --------------------------------------------------*/
route.post("/add/:ID", Verfy_Decoded_Token, async (req, res) => {
  try {
    const { error } = Vailedata_Add_Comment(req.body);
    if (error) {
      return res.status(200).json({ message: error.message });
    }
    await new Comments({
      title: req.body.title,
      body: req.body.body,
      user_id: req.user.id,
      post_id: req.params.ID,
    }).save();
    return res.status(201).json({ message: "The Created is Sueecssfuly." ,status:"successfully" });
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});
/**---------------------------------------------
 * @dec    Like Comment
 * @route  /api/comment/like/:ID =>post
 * @method put
 * @access private  (only user himself)
 --------------------------------------------------*/
route.put("/like/:ID", Verfy_Decoded_Token, async (req, res) => {
  try {
    const comment = await Comments.find({ post_id: req.params.ID });
    if (comment) {
      const isAlreadyLiked = comment.likes.find((e) => e === req.user.id);
      // Add Like
      if (!isAlreadyLiked) {
        await Comments.findByIdAndUpdate(req.params.ID, {
          $push: { likes: req.user.id },
        });
        return res.status(200).json({ message: "Add Like" });
      }
      // Remove Like
      else {
        await Comments.findByIdAndUpdate(req.params.ID, {
          $pull: { likes: req.params.ID },
        });
        return res.status(200).json({ message: "Remove Like" });
      }
    } else {
      return res.status(200).json({ message: "This Comment is not found!" });
    }
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

/**---------------------------------------------
 * @dec    Get All Comments
 * @route  /api/comment/
 * @method Get
 * @access private  (only Admin)
 --------------------------------------------------*/
route.get("/", Verfy_Token, async (req, res) => {
  try {
    const comments = await Comments.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: comments });
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});
/**---------------------------------------------
 * @dec    Delete Comments
 * @route  /api/comment/delete/:ID
 * @method Delete
 * @access private  (only Admin or user himself)
 --------------------------------------------------*/
route.delete("/delete/:ID", Verfy_Decoded_Token, async (req, res) => {
  try {
    const comment = await Comments.findById(req.params.ID);
    if (comment) {
      if (req.user.id === comment.user_id) {
        return await Comments.findByIdAndDelete(req.params.ID);
        res.status(200).json({ message: "The Deleted isd Sueesccfuly" });
      } else {
        return res
          .status(401)
          .json({ message: "You Don`t have this Authority! " });
      }
    } else {
      return res.status(200).json({ message: "This Comment is not found!" });
    }
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

/**---------------------------------------------
 * @dec    Update Comment
 * @route  /api/comment/update/:ID
 * @method put
 * @access private  (only  user himself)
 --------------------------------------------------*/
route.put("/updata/:ID", Verfy_Decoded_Token, async (req, res) => {
  try {
    const { error } = Vailedata_Updata_post(req.body);
    if (error) {
      return res.status(200).json({ message: error.message });
    }
    const comment = await Comments.findById(req.params.ID);
    if (comment) {
      if (comment.user_id === req.user.id) {
        await Comments.findByIdAndUpdate(req.params.ID, {
          title: req.body.title,
          body: req.body.body,
        });
        return res.status(200).json({ messgae: "The Updata is Sueesccfuly " });
      } else {
        return res
          .status(401)
          .json({ messgae: "You Connot Updata this comments " });
      }
    } else {
      return res.status(200).json({ message: "This comment is not found!" });
    }
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

/**---------------------------------------------
 * @dec    Get Comment by post
 * @route  /api/comment/:ID
 * @method get
 * @access public  
 --------------------------------------------------*/
route.get("/:ID", async (req, res) => {
  try {
    const comments = await Comments.find({ post_id: req.params.ID }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ date: comments });
  } catch (E) {
    return res.status(200).json({ message: E });
  }
});

module.exports = route;

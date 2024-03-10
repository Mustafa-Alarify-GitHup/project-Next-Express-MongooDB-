const mongoose = require('mongoose');
const Joi = require("joi");

const schema_Comments = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    body: {
        type: String,
        require: true,
        trim: true,
        minlength: 10,
    },
    user_id: {
        type: String,
        require: true,
    },
    post_id: {
        type: String,
        require: true,
    },
    likes: [{
        type: String
    }]

}, { timestamps: true });

const Comments = mongoose.model("comment", schema_Comments);


// Validation Values
function Vailedata_Add_Comment(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().max(100).required(),
        body: Joi.string().trim().min(10).required(),
    });
    return schema.validate(obj);
}

function Vailedata_Updata_Comment(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().min(2).max(100),
        body: Joi.string().trim().min(10),
    });
    return schema.validate(obj);
}

module.exports = {
    Comments,
    Vailedata_Add_Comment,
    Vailedata_Updata_Comment,
}
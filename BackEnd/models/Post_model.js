const mongoose = require('mongoose');
const Joi = require("joi");

const schema_Post = new mongoose.Schema({
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
    user: {
        type: String,
        require: true,
    },
    category: {
        type: String,
        require: true,

    },
    likes: [{
        type: String
    }]

}, { timestamps: true });

const Posts = mongoose.model("post", schema_Post);


// Validation Values
function Vailedata_Add_post(obj) {
    const schema = Joi.object({
        title: Joi.string().trim().required(),
        body: Joi.string().trim().required(),
        category: Joi.string().trim().required()
    });
    return schema.validate(obj);
}
function Vailedata_Updata_post(obj) {
    const schema = Joi.object({
        title: Joi.string().trim(),
        body: Joi.string().trim(),
        category: Joi.string().trim()
    });
    return schema.validate(obj);
}
// Exports
module.exports = {
    Posts,
    Vailedata_Add_post,
    Vailedata_Updata_post,
}
const mongoose = require('mongoose');
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const schema_user = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 2,
        maxlength: 100,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 8,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    photo: {
        type: Object,
        default: {
            url: "",
            publicId: null,
        }

    }
}, { timestamps: true });

// Token
schema_user.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            id: this._id,
            isAdmin: this.isAdmin,
        },
        process.env.SCRIPT_key,
        { expiresIn: '30m' });
}


const Users = mongoose.model("user", schema_user);


// Validation Values    
 
// Vaildata Sign in * 
function Vailedata_Sign_Users(obj) { 
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        username: Joi.string().trim().min(2).max(200).required(),
        password: Joi.string().min(8).max(200).required()
    });
    return schema.validate(obj);
}
// Validata Login User  
function Vailedata_Login_Users(obj) {
    const schema = Joi.object({
        email: Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().min(8).max(200).required()
    });
    return schema.validate(obj);
}
// Validata Updata User
function Vailedata_Updata_Users(obj) {
    const schema = Joi.object({
        username: Joi.string().trim().min(2).max(200),
        password: Joi.string().min(8).max(200)
    });
    return schema.validate(obj);
}

// Exports
module.exports = {
    Users,
    Vailedata_Sign_Users,
    Vailedata_Login_Users,
    Vailedata_Updata_Users,
}
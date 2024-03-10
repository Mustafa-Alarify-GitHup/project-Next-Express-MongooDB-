const jwt = require("jsonwebtoken");

const Verfy_Token_Admin_User = async (req, res, next) => {
    const token_Auth = req.headers.token;
    if (token_Auth) {
        const decoded = jwt.verify(token_Auth, process.env.SCRIPT_key);
        if (decoded.isAdmin || decoded.id === req.params.ID) {
            next();
        }else{
            return res.status(200).json({ message: "You Don`t have this Authority!" })
        }
    } else {
        return res.status(200).json({ message: "no token provided" })
    }

}
module.exports = { Verfy_Token_Admin_User };
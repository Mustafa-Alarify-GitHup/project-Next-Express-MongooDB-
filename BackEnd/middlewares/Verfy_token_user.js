const jwt = require("jsonwebtoken");

const Verfy_Token_user = async (req, res, next) => {
    const tokenAuth = req.headers.token;
    if (tokenAuth) {
        try {
            const decoded = jwt.verify(tokenAuth, process.env.SCRIPT_key);
            req.user = decoded;
            if (req.params.ID === req.user.id) {
                next();
            } else {
                res.status(200).json({ message: "this user isn't Account himself " })
            }
        } catch (E) {
            res.status(200).json({ message: `${E}` });
        }
    } else {
        res.status(200).json({ message: "no token provided" });
    }
}


module.exports = { Verfy_Token_user };
const jwt = require("jsonwebtoken");

const Verfy_Decoded_Token = async (req, res, next) => {
    const tokenAuth = req.headers.token;
    if (tokenAuth) {
        try {
            const decoded = jwt.verify(tokenAuth, process.env.SCRIPT_key);
            req.user = decoded;
            console.log(decoded.id)
            next();
        } catch (E) {
            res.status(200).json({ message: `${E}` });
        }
    } else { 
        res.status(200).json({ message: "no token provided" });
    }
}


module.exports = { Verfy_Decoded_Token };
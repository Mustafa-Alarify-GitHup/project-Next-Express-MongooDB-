const jwt = require("jsonwebtoken");


const Verfy_Token = async (req, res, next) => {
  const tokenAuth = req.headers.token;
  console.log(tokenAuth)
  if (tokenAuth) {
    try {
      const decoded = jwt.verify(tokenAuth, process.env.SCRIPT_key);
      req.user = decoded;
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(200).json({ message: "You Isnot Admin !" })
      }
    } catch (E) {
      res.status(200).json({ message: `${E}` });
    }
  } else {
    res.status(200).json({ message: "no token provided" });
  }
}


module.exports = { Verfy_Token };
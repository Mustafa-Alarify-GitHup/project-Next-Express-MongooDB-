/**
 * @res  404 return json Not founed instead return error HTML
 */

const notFouned = (req,res,next) => {
    const error = new Error(`Not Founed => ${req.originaUrl}` )
    res.status(404).json({"massage":"Not Founed"});
    next(error);
}
const errorHandler = (err ,req,res,next)=>{
    const statusCode = res.statusCode === 200 ? 500:res.statusCode;
    res.status(statusCode).json({"massage":err.massage});
}

module.exports ={notFouned,errorHandler}
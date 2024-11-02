import jwt from "jsonwebtoken";

const authUser = async (req, res, next)=>{
    console.log('authUser 1 ');
    try {
        const {token} = req.headers;
        console.log('token in authUser 2 =  ', req.headers);
        if(!token) {
            return res.json({success: false, message: 'Not authorized Login Again'})
        }
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        // if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ){
        //     return res.json({success: false, message: 'Not authorized Login Again'})
        // }
        req.body.userId = token_decode.id;

        next()
    } catch (error) {
        console.log("error = ", error)
        res.json({success: false, message: error.message})
    }
}

export default authUser;


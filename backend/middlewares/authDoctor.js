import jwt from "jsonwebtoken";

const authDoctor = async (req, res, next)=>{
    console.log('authDoctor 1 ');
    try {
        const {dtoken} = req.headers;
        console.log('token in authUser 2 =  ', req.headers);
        if(!dtoken) {
            return res.json({success: false, message: 'Not authorized Login Again'})
        }
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
        // if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD ){
        //     return res.json({success: false, message: 'Not authorized Login Again'})
        // }
        req.body.docId = token_decode.id;

        next()
    } catch (error) {
        console.log("error = ", error)
        res.json({success: false, message: error.message})
    }
}

export default authDoctor;


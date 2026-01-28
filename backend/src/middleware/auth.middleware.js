import jsonwebtoken from 'jsonwebtoken';
import authModel from '../models/authModel.js';

export const authMiddleware=async (req,res,next)=>{
	try{
		const token=req.cookies?.token;
		if(!token){
			return res.status(400).json({
				message:"Token not found"
			});
		}


		const decoded= jsonwebtoken.verify(token,process.env.JWT_SECRET);
		console.log(decoded);
		
		const user = await authModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = user;

    next(); 
		
	}
	catch(err){
		console.log(err.message);
	}
}
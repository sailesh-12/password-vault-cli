import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({encoding:"utf-8"});
const connectDb=async () => {
	try{
		const uri=process.env.MONGO_DB_URI;
	    const connection=await mongoose.connect(uri);
		if(connection){
			console.log("Mongo db successfully connected");
		}		
	}
	catch(err){
		console.error(err)
	}
}

export default connectDb
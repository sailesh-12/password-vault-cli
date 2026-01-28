import mongoose from "mongoose";
const {Schema}=mongoose;

const authSchema=new Schema({
	username:{
		type:String,
		minLength:6,
	},
	email:{
		type:String,
		required:true
	},
	password:{
		type:String,
		required:true,
		minLength:8,
	},
	
	date_of_birth:{
		type:Date,
		required:true
	}

});

const authModel=mongoose.model("auth_infos",authSchema);

export default authModel


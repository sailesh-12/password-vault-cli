import mongoose, { Schema } from 'mongoose';

const noteSchema=mongoose.Schema({
	title:{
		type:String,
		required:true
	},
	content:{
		type:String,
		required:true,
	},
	password:{
		type:String,
		required:true
	},
	userId:{
		type:Schema.Types.ObjectId,
	}
},{
	timestamps:true
});

const passwordModel=await mongoose.model("passwords",noteSchema);

export default passwordModel;
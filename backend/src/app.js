import express from 'express';
import authrouter from './routes/auth.route.js';
import notesrouter from './routes/password.route.js'
import cors from 'cors';
import cookieparser from 'cookie-parser';


const app=express();
//middleware
app.use(cors());
app.use(express.json())
app.use(cookieparser());
app.use("/auth",authrouter);
app.use("/notes",notesrouter);
// Health checking route
app.get("/health",(req,res)=>{
	res.send({
		message:"Healthy server"
	});
});

export default app

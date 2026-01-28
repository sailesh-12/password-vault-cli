import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import authModel from "../models/authModel.js";
import dotenv from "dotenv";

dotenv.config();
export const signup = async (req, res) => {
  try {
    const { username, email, password, date_of_birth } = req.body;

    if (!username || !email || !password || !date_of_birth) {
      return res.status(400).json({
        message: "Invalid Input credentials",
      });
    }

    const existingUser = await authModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    //hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser = new authModel({
      username,
      email,
      password: hashedPassword,
      date_of_birth,
    });

    const token = jsonwebtoken.sign(
      {
        id: newuser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log(token);

    await newuser.save();

    return res.status(201).json({
      message: "user created",
      token,
      newuser,
    });
  } catch (err) {
    console.error(err.message);
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Invalid Inputs fields",
      });
    }
    const existinguser = await authModel.findOne({ email });
    if (!existinguser) {
      return res.status(401).json({
        message: "User is not found.",
      });
    }
    //Verify password
    const isMatch = await bcrypt.compare(password, existinguser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jsonwebtoken.sign(
      {
        id: existinguser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true, // JS cannot read it
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      token: token,
      existinguser,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const logout=async (req,res)=>{
  try{
    res.clearCookie("token",{
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    return res.status(200).json({
      message:"Logout successful"
    })
  }
  catch(err){
    console.log(err.message);
  }
}

export const getUsers = async (req, res) => {
  const users = await authModel.find().select("-password");
  return res.status(200).json({
    message: "Users fetched successfully",
    users,
  });
};

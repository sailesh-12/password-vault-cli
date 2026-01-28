import passwordModel from "../models/passwordModel.js";
import Crypto from 'crypto-js';
export const createPost=async (req , res)=>{
	try{
		const {title,content,password}=req.body;
		
		if(!title || !content || !password	){
			return res.status(400).json({
				message:"User is not found"
			});
		}

		const user=req.user;
		if(!user){
			return res.status(401).json({
				message:"Unauthorized"
			})
		}

		const id=user._id;
		const notes=await passwordModel.create({
			title,
			content,
			password: Crypto.AES.encrypt(password, process.env.SECRET_KEY).toString(),
			userId:id
		});

		return res.status(200).json({
			message:"Password created successfully",
			notes
		});
	
	}
	catch(err){
		console.log(err.message);
	}
}

export const getAllNotes=async (req,res)=>{
	try{
		const existingPasswords=await passwordModel.find();
		if(!existingPasswords){
			return res.status(401).json({
				message:"No password exits"
			})
		}

		return res.status(200).json({
			message:"Password Details for user",
			existingPasswords
		})	;
	}
	catch(err){
		console.log(err);
		return res.status(500).json({
			message:"Internal Server error"
		})
	}
}

export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const note = await passwordModel.findOne({ _id: id, userId: user._id });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json({
            message: "Note retrieved successfully",
            note
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, password } = req.body;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (content) updateData.content = content;
        if (password) {
            updateData.password = Crypto.AES.encrypt(password, process.env.SECRET_KEY).toString();
        }

        const updatedNote = await passwordModel.findOneAndUpdate(
            { _id: id, userId: user._id },
            updateData,
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json({
            message: "Note updated successfully",
            note: updatedNote
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const deletedNote = await passwordModel.findOneAndDelete({
            _id: id,
            userId: user._id
        });

        if (!deletedNote) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        return res.status(200).json({
            message: "Note deleted successfully"
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

export const decryptPassword = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const note = await passwordModel.findOne({ _id: id, userId: user._id });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        const decryptedPassword = Crypto.AES.decrypt(
            note.password,
            process.env.SECRET_KEY
        ).toString(Crypto.enc.Utf8);

        return res.status(200).json({
            message: "Password decrypted successfully",
            password: decryptedPassword
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};

export const getUserNotes = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        const userNotes = await passwordModel.find({ userId: user._id });

        return res.status(200).json({
            message: "User notes retrieved successfully",
            notes: userNotes
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            message: "Internal Server error"
        });
    }
};